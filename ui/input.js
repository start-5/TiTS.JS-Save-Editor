/**
 * @typedef {Object} FieldOptions
 * @property {string} [labelText] The field's label
 * @property {string} [suffixText] Text to show in the input's suffix area
 * @property {boolean} [pcOnly] Whether this field should apply to the PC only
 * @property {string} [koChanged] KO func to run when the field's value changes
 * @property {string} [koVisible] KO func to run to determine whether the field should be visible
 */


/**
 * @typedef {Object} NumericFieldOptions
 * @property {string} [labelText] The field's label
 * @property {string} [suffixText] Text to show in the input's suffix area
 * @property {boolean} [pcOnly] Whether this field should apply to the PC only
 * @property {string} [koChanged] KO func to run when the field's value changes
 * @property {string} [koVisible] KO func to run to determine whether the field should be visible
 * @property {number} [min] The minimum value allowed for the field
 * @property {number} [max] The maximum value allowed for the field
 */


/**
 * The base for all editor fields
 */
class Field {

    constructor() {

        /**
        * Contains all the field content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');
        this.content.classList.add('my-3');

        /**
        * The field's label element
        * @type {HTMLLabelElement}
        */
        this.label = document.createElement('label');
        this.label.classList.add('label-sm');

        /**
        * The field's input element
        * @type {HTMLInputElement}
        */
        this.input = document.createElement('input');
        this.input.classList.add('form-control', 'form-control-sm');
        util.setKoBinding(this.input, 'enable', '$root.saveLoaded');
        this.input.setAttribute('disabled', true);

        /**
        * Contains the field's input and label
        * @type {HTMLDivElement}
        */
        this.inputWrapper = document.createElement('div');
        this.inputWrapper.classList.add('input-group', 'input-group-sm');
        this.inputWrapper.appendChild(this.input);

        this.content.appendChild(this.label);
        this.content.appendChild(this.inputWrapper);

    }


    /**
    * Returns the field and all its content
    */
    build() {
        return this.content;
    }


    /**
    * Resolve editor label
    * @param {string} key
    * @param {string} labelText
    */
    resolveLabel(key, labelText) {
        this.input.id = `edit-${key}`;
        this.label.innerText = labelText;
        this.label.htmlFor = this.input.id;
    }

    /**
    * Resolve editor suffix
    * @param {string} suffixText
    */
    resolveSuffix(suffixText) {

        const spanSuffix = document.createElement('span');
        spanSuffix.classList.add('input-group-text');
        spanSuffix.textContent = suffixText;

        this.input.classList.add('form-control-suffix');
        this.inputWrapper.appendChild(spanSuffix);

    }

    /**
    * Resolve multiple editor options
    * @param {FieldOptions} options
    */
    resolveOptions(options) {
        this.resolveVisible(options.koVisible);
        this.resolvePcOnly(options.pcOnly);
        this.resolveSuffix(options.suffixText);
    }

    /**
    * Resolve a KO PcOnly binding
    * @param {boolean} pcOnly
    */
    resolvePcOnly(pcOnly) {
        if (pcOnly) {
            const previousBinding = util.getKoBinding(this.input, 'enable');
            util.setKoBinding(this.input, 'enable', `${previousBinding} && $root.isPC`);
        }
    }

    /**
    * Resolve a KO OnChanged binding
    * @param {string} koChanged
    */
    resolveOnChanged(koChanged) {
        if (koChanged) {
            util.setKoBinding(this.input, 'event', `{ change: $root.${koChanged} }`);
        }
    }

    /**
    * Resolve a KO visible binding
    * @param {string} koVisible
    */
    resolveVisible(koVisible) {
        if (koVisible) {
            util.setKoBinding(this.input, 'visible', koVisible);
        }
    }

}


/**
* A text field
*/
class TextField extends Field {

    /**
    * Creates an editor text field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {FieldOptions} options
    */
    constructor(root, key, options) {

        super();

        this.input.type = 'text';

        util.setKoBinding(this.input, 'textInput', util.getObjPath(root, key));

        this.resolveOptions(options);

        this.resolveLabel(key, options.labelText);

    }

}


/**
* A numeric field
*/
class NumericField extends Field {

    /**
    * Creates an editor numeric field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {NumericFieldOptions} options
    */
    constructor(root, key, options) {

        super();

        this.input.type = 'number';

        util.setKoBinding(this.input, 'numberInput', util.getObjPath(root, key));

        if (options.koChanged) {
            options.koChanged =
                `function() {
                    $root.${options.koChanged};
                    $root.validateNumberInput;
                }`;
        }
        else {
            options.koChanged = 'validateNumberInput';
        }

        this.resolveOptions(options);

        this.resolveLabel(key, options.labelText);

        if (!isNaN(parseFloat(options.min))) {
            this.input.min = options.min;
        }
        if (!isNaN(parseFloat(options.max))) {
            this.input.max = options.max;
        }

    }

}


/**
* An integer specific numeric field
*/
class IntegerField extends NumericField {

    /**
    * Creates an editor integer field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {NumericFieldOptions} options
    */
    constructor(root, key, options) {

        super(root, key, options);

        this.input.step = 1;
        this.input.pattern = '\d*';

    }

}


/**
* A float specific numeric field
*/
class FloatField extends Field {

    /**
    * Creates an editor float field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {NumericFieldOptions} options
    */
    constructor(root, key, options) {

        super(root, key, options);

        this.input.step = 'any';
    }

}


/**
* A multiple selection drop down field
*/
class SelectField extends Field {

    /**
    * Creates an editor drop down select field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {string} source The object path of the drop down items source
    * @param {FieldOptions} options
    */
    constructor(root, key, source, options) {

        super();

        /**
        * The field's select element
        * @type {HTMLSelectElement}
        */
        this.select = document.createElement('select');
        this.select.classList.add('form-select', 'form-select-sm');
        this.select.setAttribute('disabled', true);
        this.select.value = '-999';
        this.inputWrapper.replaceChild(this.select, this.input);

        util.setKoBinding(this.select, 'options', `$root.getGlobal('${source}')`);
        util.setKoBinding(this.select, 'optionsText', 'name');
        util.setKoBinding(this.select, 'optionsValue', 'value');
        util.setKoBinding(this.select, 'value', util.getObjPath(root, key));
        util.setKoBinding(this.select, 'enable', '$root.saveLoaded');

        this.resolveOptions(options);

        this.resolveSelectLabel(key, options.labelText);

    }


    /**
    * Resolve editor drop down label
    * @param {string} key
    * @param {string} labelText
    */
    resolveSelectLabel(key, labelText) {
        this.select.id = `edit-${key}`;
        this.label.innerText = labelText;
        this.label.htmlFor = this.select.id;
    }

}


/**
* A bool field
*/
class SwitchField extends Field {

    /**
    * Creates an editor bool field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {string} source The object path of the drop down items source
    * @param {NumericFieldOptions} options
    */
    constructor(root, key, options) {

        super();

        this.inputWrapper.classList.add('form-check', 'form-switch');

        this.input.type = 'checkbox';
        this.input.role = 'switch';
        this.input.classList.add('form-check-input');

        util.setKoBinding(this.input, 'checked', util.getObjPath(root, key));

        this.resolveOptions(options);

        this.resolveLabel(key, options.labelText);

        this.label.classList.add('form-check-label');
        this.inputWrapper.appendChild(this.label);

    }

}


/**
* A body flag field
*/
class FlagField {

    /**
    * Creates an editor body flag field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {string} source The object path of the drop down items source
    * @param {FieldOptions} options
    */
    constructor(root, key, source, options) {

        /**
        * Contains all the field content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');
        this.content.classList.add('accordion', 'w-100', 'pt-2', 'my-3');
        this.content.id = `edit-${key}`;

        /**
        * The accordion item wrapper
        * @type {HTMLDivElement}
        */
        this.accordionItem = document.createElement('div');
        this.accordionItem.className = 'accordion-item';

        /**
        * The accordion header
        * @type {HTMLHeadingElement}
        */
        this.accordionHeader = document.createElement('h6');
        this.accordionHeader.className = 'accordion-header';
        this.accordionHeader.id = `${this.content.id}-header`;

        /**
        * The accordion collapse/expand toggle button
        * @type {HTMLButtonElement}
        */
        this.accordionButton = document.createElement('button');
        this.accordionButton.type = 'button';
        this.accordionButton.classList.add('accordion-button');
        this.accordionButton.setAttribute('data-bs-toggle', 'collapse');
        this.accordionButton.setAttribute('aria-expanded', 'true');
        this.accordionButton.textContent = options.labelText;

        /**
        * The accordion body wrapper
        * @type {HTMLDivElement}
        */
        this.accordionBodyContainer = document.createElement('div');
        this.accordionBodyContainer.classList.add('accordion-collapse', 'collapse', 'show');
        this.accordionBodyContainer.setAttribute('aria-labelledby', `#${this.accordionHeader.id}`);
        this.accordionBodyContainer.setAttribute('data-bs-parent', `#${this.accordionHeader.id}`);
        this.accordionBodyContainer.id = `${this.content.id}-body`;

        this.accordionButton.setAttribute('aria-controls', this.accordionBodyContainer.id);
        this.accordionButton.setAttribute('data-bs-target', `#${this.accordionBodyContainer.id}`);

        /**
        * The accordion actual body
        * @type {HTMLDivElement}
        */
        this.accordionBody = document.createElement('div');
        this.accordionBody.classList.add('accordion-body', 'd-flex', 'flex-wrap');
        util.setKoBinding(this.accordionBody, 'foreach', `$root.getGlobal('${source}')`);

        /**
        * Holds the foreach template
        * @type {HTMLDivElement}
        */
        this.templateContainer = document.createElement('div');
        this.templateContainer.classList.add('form-check', 'form-switch', 'flag-switch-row');

        /**
        * Templated checkbox
        * @type {HTMLInputElement}
        */
        this.templateCheckbox = document.createElement('input');
        this.templateCheckbox.type = 'checkbox';
        this.templateCheckbox.role = 'switch';
        this.templateCheckbox.className = 'form-check-input';
        this.templateCheckbox.setAttribute('disabled', true);
        util.setKoBinding(this.templateCheckbox, 'checked', `parent.${util.getObjPath(root, key)}`);
        util.setKoBinding(this.templateCheckbox, 'checkedValue', '$data.value');
        util.setKoBinding(this.templateCheckbox, 'enable', '$root.saveLoaded');

        if (options.koChanged) {
            util.setKoBinding(this.templateCheckbox, 'event', `{ change: ${options.koChanged} }`);
        }

        /**
        * Templated checkbox
        * @type {HTMLInputElement}
        */
        this.templateCheckboxLabel = document.createElement('label');
        this.templateCheckboxLabel.classList.add('form-check-label', 'label-sm');
        util.setKoBinding(this.templateCheckboxLabel, 'text', 'name');

        this.templateContainer.appendChild(this.templateCheckbox);
        this.templateContainer.appendChild(this.templateCheckboxLabel);

        this.accordionBody.appendChild(this.templateContainer);

        this.accordionHeader.appendChild(this.accordionButton);
        this.accordionBodyContainer.appendChild(this.accordionBody);

        this.accordionItem.appendChild(this.accordionHeader);
        this.accordionItem.appendChild(this.accordionBodyContainer);

        this.content.appendChild(this.accordionItem);

    }

    /**
    * Returns the field and all its content
    */
    build() {
        return this.content;
    }

}


/**
* An array field
*/
class ArrayField {

    /**
    * Creates an editor array field
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {string} koDescript The KO Func to use to describe items
    * @param {string} koDelete The KO Func to remove an item from the array
    * @param {Array<Field>} fields The list of fields modifiable for each item
    */
    constructor(root, key, koDescript, koDelete, fields) {

        /**
        * Contains all the field content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');
        this.content.classList.add('my-3', 'w-100');
        util.setKoBinding(this.content, 'foreach', util.getObjPath(root, key));

        /**
        * Templated accordion item wrapper
        * @type {HTMLDivElement}
        */
        this.templateAccordionItem = document.createElement('div');
        this.templateAccordionItem.classList.add('accordion-item');

        /**
        * Templated accordion item wrapper
        * @type {HTMLHeadingElement}
        */
        this.templateAccordionHeader = document.createElement('h6');
        this.templateAccordionHeader.classList.add('accordion-header');
        util.setKoBinding(this.templateAccordionHeader, 'attr', `{ id: 'edit-${key}-' + $index() + '-header' }`);

        /**
        * Templated accordion collapse/expand toggle button
        * @type {HTMLButtonElement}
        */
        this.templateAccordionButton = document.createElement('button');
        this.templateAccordionButton.type = 'button';
        this.templateAccordionButton.classList.add('accordion-button');
        this.templateAccordionButton.setAttribute('data-bs-toggle', 'collapse');
        this.templateAccordionButton.setAttribute('aria-expanded', 'false');
        util.setKoBinding(this.templateAccordionButton, 'text', `$root.${koDescript}($index)`);
        util.setKoBinding(this.templateAccordionButton, 'attr',
            `{
                'aria-controls': 'edit-${key}-' + $index() + '-body',
                'data-bs-target': '#edit-${key}-' + $index() + '-body'
             }`
        );

        /**
        * Templated accordion body wrapper
        * @type {HTMLButtonElement}
        */
        this.templateAccordionBodyContainer = document.createElement('div');
        this.templateAccordionBodyContainer.classList.add('accordion-collapse', 'collapse');
        util.setKoBinding(this.templateAccordionBodyContainer, 'attr',
            `{
                'id': 'edit-${key}-' + $index() + '-body'
                'aria-labelledby': '#edit-${key}-' + $index() + '-header',
                'data-bs-parent': '#edit-${key}-' + $index() + '-header'
            }`
        );

        /**
        * Templated accordion actual body
        * @type {HTMLButtonElement}
        */
        this.templateAccordionBody = document.createElement('div');
        this.templateAccordionBody.classList.add('accordion-body');

        const btnRemoveContainer = document.createElement('div');
        btnRemoveContainer.classList.add('d-flex', 'justify-content-end');

        /**
        * Templated delete buttn
        * @type {HTMLButtonElement}
        */
        this.btnDelete = document.createElement('button');
        this.btnDelete.innerHTML = 'Remove <i class="fa-solid fa-trash"></i>';
        this.btnDelete.type = 'button';
        this.btnDelete.disabled = true;
        this.btnDelete.classList.add('btn', 'btn-danger', 'btn-sm');
        util.setKoBinding(this.btnDelete, 'click', `$root.${koDelete}`);
        util.setKoBinding(this.btnDelete, 'enable', '$root.saveLoaded');

        btnRemoveContainer.appendChild(this.btnDelete);

        this.templateAccordionBody.appendChild(btnRemoveContainer);


        for (var i = 0; i < fields.length; i++) {

            const content = fields[i].build();

            if (i === 0) {
                content.classList.add('mt-0');
            }

            this.templateAccordionBody.appendChild(content);
        }


        this.templateAccordionHeader.appendChild(this.templateAccordionButton);
        this.templateAccordionBodyContainer.appendChild(this.templateAccordionBody);

        this.templateAccordionItem.appendChild(this.templateAccordionHeader);
        this.templateAccordionItem.appendChild(this.templateAccordionBodyContainer);

        this.content.appendChild(this.templateAccordionItem);

        return this.content;
    }

    /**
    * Returns the field and all its content
    */
    build() {
        return this.content;
    }

}