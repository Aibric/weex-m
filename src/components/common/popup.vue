<template>
    <div :class="['popup']"
        :style="getPopupStyle"
        v-if="showPopup"
        ref="popup">
        <div class="popup-bg"
            :style="getPopupBgStyle"
            @click.self="hide()"
            ref="popupBg">
        </div>
        <div class="popup-content"
            :style="getPopupContentStyle"
            ref="popupContent"
            @click="$event.preventDefault()">
            <slot :pos="pos"
                :hide="hide"
                :show="popuShow"
                :is-show="showPopup"></slot>
        </div>
    </div>
</template>
<script>
    import { Utils } from "weex-ui"
    import _ from 'lodash'

    const animation = weex.requireModule('animation')

    export default {
        props: {
            bgColor: {
                type: String,
                default: '#000000'
            },
            bgHeight: {
                type: Number,
                default: Utils.env.getPageHeight()
            },
            bgWidth: {
                type: Number,
                default: 750
            },
            pos: {
                type: String,
                default: 'bottom'
            },
            width: {
                type: Number,
                default: 750
            },
            height: {
                type: Number,
                default: 300
            },
            position: {
                validator (value) {
                    return ['fixed', 'absolute'].includes(value.toLocaleLowerCase())
                },
                default: 'fixed'
            },
            left: {
                type: Number,
                default: 0
            },
            top: Number,
            right: Number,
            bottom: {
                type: Number,
                default: 0
            },
            hideBgAnimation: {
                type: Object,
                default () {
                    return {}
                }
            },
            hideAnimation: {
                type: Object,
                default () {
                    return {}
                }
            },
            bgAnimation: {
                type: Object,
                default () {
                    return {}
                }
            },
            animation: {
                type: Object,
                default () {
                    return {}
                }
            },
            show: { //// :show.sync 和 @popupClicked 选其一
                type: Boolean,
                default: false
            }
        },
        computed: {
            getPopupStyle () {
                return {
                    height: `${this.bgHeight}px`,
                    width: `${this.bgWidth}px`,
                    position: this.position
                }
            },
            getPopupBgStyle () {
                return {
                    backgroundColor: this.bgColor,
                    height: `${this.bgHeight}px`,
                    width: `${this.bgWidth}px`,
                }
            },
            getPopupContentStyle () {
                return Object.assign({
                    width: `${this.width}px`,
                    height: `${this.height}px`,
                    position: this.position,
                }, this.popupContenPos)
            }
        },
        data: () => ({
            showPopup: false,
            popupContenPos: {
                left: 0,
                right: null,
                top: null,
                bottom: 0
            },
            translateX: 0,
            translateY: 0,
            defHideBgAnimation: {
                styles: {
                    opacity: 0
                },
                timingFunction: 'ease-out',
            },
            defBgAnimation: {
                styles: {
                    opacity: 0.3,
                    backgroundColor: '#000000'
                },
                duration: 500,
                timingFunction: 'ease-in',
                delay: 0, //ms
                callback () {

                }
            },
            defHideAnimation: {
                styles: {
                    opacity: 0
                },
                timingFunction: 'ease-out',
            },
            defAnimation: {
                styles: {
                    opacity: 1,
                    transform: 'translate(0px, 0px)',
                    transformOrigin: 'bottom'
                },
                duration: 500,
                timingFunction: 'ease-in',
                delay: 0, //ms
                callback () {

                }
            },
            timeOut: null
        }),
        created () {
            this.showPopup = this.show
            switch (this.pos = this.pos.toLocaleLowerCase()) {
                case 'top':
                    Object.assign(this.popupContenPos, {
                        left: `${this.left || 0}px`,
                        top: `${this.top || 0}px`,
                        bottom: null,
                        right: null,
                        transform: `translate(0px, -${this.height}px)`
                    })
                    break;
                case 'left':
                    Object.assign(this.popupContenPos, {
                        left: `${this.left || 0}px`,
                        top: `${this.top || 0}px`,
                        bottom: null,
                        right: null,
                        transform: `translate(-${this.width}px, 0px)`
                    })
                    break;
                case 'right':
                    Object.assign(this.popupContenPos, {
                        left: null,
                        top: `${this.top || 0}px`,
                        bottom: null,
                        right: `${this.right || 0}px`,
                        transform: `translate(${this.bgWidth}px, 0px)`
                    })
                    break;
                case 'bottom':
                    Object.assign(this.popupContenPos, {
                        left: `${this.left || 0}px`,
                        top: null,
                        bottom: `${this.bottom || 0}px`,
                        right: null,
                        transform: `translate(0px, ${this.bgHeight}px)`
                    })
                    break
                default:
            }
            if (this.showPopup) {
                this.popuShow()
            }
        },
        watch: {
            show (val, old) {
                this.showPopup = val
                return val
            },
            showPopup (val, old) {
                val ? this.popuShow() : this.hide()
                this.$emit('update:show', val)
                return val
            }
        },
        methods: {
            hide (event) {
                if (!this.show || !this.showPopup) return
                clearTimeout(this.timeOut)
                let bgAnimation = _.merge({}, this.defBgAnimation, this.defHideBgAnimation, this.hideBgAnimation)
                let conAnimation = _.merge({}, this.defAnimation, this.defHideAnimation, {
                    styles: {
                        transform: this.popupContenPos.transform
                    }
                }, this.hideAnimation)
                animation.transition(this.$refs.popupBg, bgAnimation, bgAnimation.callback)
                animation.transition(this.$refs.popupContent, conAnimation, () => {
                    this.showPopup = false
                    conAnimation.callback()
                    this.$emit('popupClicked', {show: this.showPopup, pos: this.pos})
                })
            },
            popuShow () {
                this.timeOut = setTimeout(() => {
                    let bgAnimation = _.merge({}, this.defBgAnimation, this.bgAnimation)
                    let conAnimation = _.merge({}, this.defAnimation, this.animation)
                    animation.transition(this.$refs.popupBg, bgAnimation, bgAnimation.callback)
                    animation.transition(this.$refs.popupContent, conAnimation, () => {
                        conAnimation.callback()
                    })
                }, 100)
            }
        }
    }
</script>
<style scoped>
.popup {
    left: 0;
    top: 0;
    overflow: hidden;
}
.popup-bg {
    opacity: 0;
}
.popup-content {
    background-color: #ffffff;
}
</style>
