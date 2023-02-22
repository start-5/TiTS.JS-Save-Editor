/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */

/** @type {ViewModel} */
var vm = undefined;


const loadMapping = {
    'flags': {
        create: function (options) {
            if (options.data.hasOwnProperty('pathOverrides')) {
                return new ko.observableDictionary({ ...Flags, ...options.data });
            }
            else {
                return options.data;
            }
        }
    }
};


var ViewModel = function (data) {
    var self = this;

    self.saveLoaded = ko.observable(false);
    self.busy = ko.observable(false);

    self.saveName = ko.observable('');
    self.originalSaveName = ko.observable('');

    self.save = {};
    ko.mapping.fromJS(data, loadMapping, self.save);

    self.getGlobal = function (path) {
        var obj = Globals;

        for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
            obj = obj[path[i]];
        }

        return obj;
    };

    self.a = function (data) {
        alert('a');
    };

    // #region Character

    self.selectedCharacter = ko.observable();

    self.chars = ko.computed(function () {
        return Object.keys(self.save.characters).map(key => ({
            name: key,
            obj: self.save.characters[key]
        }));
    }, self);

    self.isPC = ko.computed(function () {
        return self.selectedCharacter() && self.selectedCharacter().name == 'PC';
    }, self);

    // #endregion


    // #region Perks

    self.getPerks = ko.computed(function () {
        if (self.selectedCharacter()) {
            // two things are happening here, one, ensuring that characters don't have objcts that reference each other,
            // second, adding any unknown storage to the pool, i haven't found a better way to do this yet

            //let vmPerks = self.perkList;

            const vmPerks = ko.mapping.fromJS(ko.mapping.toJS(self.perkList));
            //return ko.mapping.fromJS(ko.mapping.toJS(self.perkList));
            const charPerks = self.selectedCharacter().obj.perks;

            for (var i = 0; i < charPerks().length; i++) {
                const charPerk = charPerks()[i];
                const vmPerk = vmPerks().find(p => p.storageName() === charPerk.storageName());
                if (!vmPerk) {
                    const unknownPerk = ko.mapping.fromJS(ko.mapping.toJS(new StorageClass()));
                    unknownPerk.storageName(charPerk.storageName());
                    unknownPerk.tooltip(charPerk.tooltip());
                    self.perkList.push(unknownPerk);
                }
                vmPerks.remove(p => p.storageName() === charPerks()[i].storageName());
            }

            return charPerks().concat(vmPerks()).sort((p1, p2) => p1.storageName().localeCompare(p2.storageName()));
        }
    }, self);

    //}).extend({ deferred: true });

    self.perks = self.selectedCharacter()
        ? ko.observableArray(self.selectedCharacter().obj.perks.concat(ko.mapping.fromJS(Perks)).sort((p1, p2) => p1.storageName().localeCompare(p2.storageName())))
        : ko.observableArray([]);

    self.perkList = ko.mapping.fromJS(Perks);

    self.hasPerk = function (data) {
        return self.selectedCharacter().obj.perks().find(p => p.storageName() === data.storageName()) !== undefined;
    };

    // #endregion


    // #region Status Effects

    //self.getStatusEffects = ko.computed(function () {
    self.getStatusEffects = function () {
        if (self.selectedCharacter()) {
            // two things are happening here, one, ensuring that characters don't have objcts that reference each other,
            // second, adding any unknown storage to the pool, i haven't found a better way to do this yet

            const vmStatusEffects = ko.mapping.fromJS(ko.mapping.toJS(self.statusEffectList));
            const charStatusEffects = self.selectedCharacter().obj.statusEffects;

            //for (var i = 0; i < charStatusEffects().length; i++) {
            //    const charStatusEffect = charStatusEffects()[i];
            //    const vmStatusEffect = vmStatusEffects().find(p => p.storageName() === charStatusEffect.storageName());
            //    if (!vmStatusEffect) {
            //        const unknownStatusEffect = ko.mapping.fromJS(ko.mapping.toJS(new StorageClass()));
            //        unknownStatusEffect.storageName(charStatusEffect.storageName());
            //        unknownStatusEffect.tooltip(charStatusEffect.tooltip());
            //        self.statusEffectList.push(unknownStatusEffect);
            //    }
            //    vmStatusEffects.remove(p => p.storageName() === charStatusEffects()[i].storageName());
            //}

            return charStatusEffects().concat(vmStatusEffects());//.sort((s1, s2) => s1.storageName().localeCompare(s2.storageName()));
        }
        //}, self);
    };

    self.statusEffectList = ko.mapping.fromJS(StatusEffects);
    //self.statusEffectList = ko.observableArray(StatusEffects);

    self.hasStatusEffect = function (data) {
        return self.selectedCharacter().obj.statusEffects().includes(data);
    };

    self.hasStatusEffectTooltip = function (data) {
        return !!data.tooltip;
    };

    // #endregion


    self.expandStorage = function (data, event) {
        $(event.target).next().collapse('toggle');
    };


    // #region OnChanged

    self.nameChanged = function (data, event) {
        const char = self.selectedCharacter().obj;
        const name = event.target.value;

        if (char.uniqueName() !== null && char.uniqueName() !== undefined) {
            char.uniqueName(name);
        }
        if (self.isPC()) {
            self.save.gameInstanceInfo.name(name);
            const mailObj = self.save.mailState.mails;
            for (const [key] of Object.entries(mailObj)) {
                const mail = mailObj[key];
                if (mail.hasOwnProperty('ToCache')) {
                    mail['ToCache'] = name + ' Steele';
                }
            }
        }
    };

    self.emailChanged = function (data, event) {
        const email = event.target.value;
        const mailObj = self.save.mailState.mails;

        for (const [key] of Object.entries(mailObj)) {
            const mail = mailObj[key];
            if (mail.hasOwnProperty('ToAddressCache')) {
                mail['ToAddressCache'] = email + '@SteeleTech.corp';
            }
        }
    };

    // #endregion


    // #region Validation

    self.validateNumberInput = function (data, event) {
        const input = event.target;
        const type = !!input.pattern ? 'int' : 'float';
        const val = type === 'int' ? parseInt(event.target.value) : parseFloat(event.target.value);
        input.value = !isNaN(val) ? val : '';

        if (input.value !== '' && !isNaN(input.value)) {
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (!isNaN(min) && input.value < min) {
                input.value = min;
                alert('Value must be greater than or equal to ' + min);
            }
            if (!isNaN(max) && input.value > max) {
                input.value = max;
                alert('Value must be less than or equal to ' + max);
            }
        }
        else {
            input.value = !isNaN(parseFloat(input.min)) ? +input.min : 0;
            alert(type === 'int' ? 'Value must be an integer (whole number)' : 'Value must be a number');
        }
    };

    // #endregion


    // #region Arrays


    // #region Penis

    self.getPenisName = function (index) {
        const i = self.selectedCharacter().obj.cocks()[index()];
        const color = i.cockColor();
        const len = +i.cLengthRaw() + +i.cLengthMod();
        const type = Globals.BodyType.find(t => t.value == i.cType()).name.toLowerCase();
        return `a ${color} ${len}" ${type} penis`;
    };

    self.addPenis = function () {
        self.selectedCharacter().obj.cocks.push(ko.mapping.fromJS(new Cock()));
    };

    self.removePenis = function (data) {
        self.selectedCharacter().obj.cocks.remove(data);
    };

    // #endregion


    // #region Vagina

    self.getVaginaName = function (index) {
        const i = self.selectedCharacter().obj.vaginas()[index()];
        const color = i.vaginaColor();
        const type = Globals.BodyType.find(t => t.value == i.type()).name.toLowerCase();
        return 'a ' + color + ' ' + type + ' vagina';
    };

    self.addVagina = function () {
        self.selectedCharacter().obj.vaginas.push(ko.mapping.fromJS(new Vagina()));
    };

    self.removeVagina = function (data) {
        self.selectedCharacter().obj.vaginas.remove(data);
    };

    // #endregion


    // #region Breasts

    self.getBreastName = function (index) {
        const i = self.selectedCharacter().obj.breastRows()[index()];
        const count = +i.breasts();
        const rating = +i.breastRatingRaw() + +i.breastRatingMod();
        return count + ' ' + util.getCupSize(rating) + ' breast' + (count > 1 ? 's' : '');
    };

    self.addBreastRow = function () {
        self.selectedCharacter().obj.breastRows.push(ko.mapping.fromJS(new BreastRow()));
    };

    self.removeBreastRow = function (data) {
        self.selectedCharacter().obj.breastRows.remove(data);
    };

    // #endregion


    // #endregion

};


function koInit() {

    // Custom handler to write actual numbers and not strings when needed
    ko.bindingHandlers.numberInput = {

        init: function (element, valueAccessor, allBindingsAccessor) {
            var underlyingObservable = valueAccessor();

            var interceptor = ko.pureComputed({
                owner: this,
                read: underlyingObservable,
                write: function (value) {
                    underlyingObservable(+value);
                }
            });

            ko.bindingHandlers.textInput.init(element, function () {
                return interceptor;
            }, allBindingsAccessor);
        },

        update: function (element, valueAccessor, allBindingsAccessor) {
            element.value = valueAccessor()();
        }

    };

}