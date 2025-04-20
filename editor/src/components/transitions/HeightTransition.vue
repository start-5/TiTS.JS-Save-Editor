<script setup lang="ts">
type Style = {
  height: string;
  width: string;
  position: string;
  visibility: string;
  overflow: string;
  paddingTop: string;
  paddingBottom: string;
  borderTopWidth: string;
  borderBottomWidth: string;
  marginTop: string;
  marginBottom: string;
}

const closed = '0px';
const duration = 250;
const easing = 'ease-in-out';

const keyframeAnimationOptions: KeyframeAnimationOptions = {
  duration,
  easing,
};

function getStyle(element: HTMLElement): Style {
  return {
    height: element.style.height,
    width: element.style.width,
    position: element.style.position,
    visibility: element.style.visibility,
    overflow: element.style.overflow,
    paddingTop: element.style.paddingTop,
    paddingBottom: element.style.paddingBottom,
    borderTopWidth: element.style.borderTopWidth,
    borderBottomWidth: element.style.borderBottomWidth,
    marginTop: element.style.marginTop,
    marginBottom: element.style.marginBottom,
  };
}

function prepareElement(element: HTMLElement, style: Style): string {
  const { width } = getComputedStyle(element);
  element.style.width = width;
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.height = '';

  let { height } = getComputedStyle(element);
  element.style.width = style.width;
  element.style.position = style.position;
  element.style.visibility = style.visibility;
  element.style.height = closed;
  element.style.overflow = "hidden";

  return style.height && style.height != closed
    ? style.height
    : height;
}

function getKeyframes(height: string, style: Style): Keyframe[] {
  return [
    {
      height: closed,
      opacity: 0,
      paddingTop: closed,
      paddingBottom: closed,
      borderTopWidth: closed,
      borderBottomWidth: closed,
      marginTop: closed,
      marginBottom: closed,
    },
    {
      height,
      opacity: 1,
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      borderTopWidth: style.borderTopWidth,
      borderBottomWidth: style.borderBottomWidth,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,
    },
  ];
}

function animate(element: HTMLElement, style: Style, done: () => void, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  const animation = element.animate(keyframes, options);

  element.style.height = style.height;

  animation.onfinish = function () {
    element.style.overflow = style.overflow;
    done();
  };
}

function onEnter(element: Element, done: () => void) {
  const htmlElement = element as HTMLElement;

  const style = getStyle(htmlElement);
  const height = prepareElement(htmlElement, style);
  const keyframes = getKeyframes(height, style);

  animate(htmlElement, style, done, keyframes, keyframeAnimationOptions);
}

function onLeave(element: Element, done: () => void) {
  const htmlElement = element as HTMLElement;

  const style = getStyle(htmlElement);
  const { height } = getComputedStyle(htmlElement);
  const keyframes = getKeyframes(height, style).reverse();

  htmlElement.style.height = height;
  htmlElement.style.overflow = "hidden";

  animate(htmlElement, style, done, keyframes, keyframeAnimationOptions);
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <slot></slot>
  </Transition>
</template>
