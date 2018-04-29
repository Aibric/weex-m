<template>
  <div class="stepper">
    <div class="stepper-minus"
        @click="minusClicked"
        aria-label="减数"
        :accessible="true"
        :style="minusStyle">
        <text class="stepper-icon"
        :style="{color: isLess 
            ? '#cccccc' 
            : '#666666' }">-</text>
    </div>
    <input class="stepper-input"
        type="number"
        :value="value"
        :style="Object.assign(disableStyle, inputStyle || {})"
        :disabled="disabled || readOnly"
        @input="onInput"
        @blur="onBlur" />
    <div class="stepper-plus"
        aria-label="加数"
        :accessible="true"
        :style="plusStyle"
        @click="plusClicked">
        <text class="stepper-icon"
        :style="Object.assign({color: isOver 
            ? '#cccccc'
            : '#666666' }, iconStyle || {})">+</text>
    </div>
  </div>
</template>
<script>

    export default {
        props: {
            min: {
                type: [String, Number],
                default: 1
            },
            max: {
                type: [String, Number],
                default: 100
            },
            step: {
                type: [String, Number],
                default: 1
            },
            params: [Boolean, Number, String, Object, Array],
            disabled: {
                type: Boolean,
                default: false
            },
            defaultValue: {
                type: [String, Number],
                default: 1
            },
            readOnly: {
                type: Boolean,
                default: false
            },
            minusStyle: {
                type: Object
            },
            plusStyle: {
                type: Object
            },
            inputStyle: {
                type: Object
            },
            iconStyle: {
                type: Object
            }
        },
        computed: {
            disableStyle() {
                if (this.disabled) {
                    return {
                        color: "#cccccc"
                    };
                }
                return {}
            },
            valueString() {
                return this.value.toString();
            }
        },
        data: () => ({
            value: 1,
            isLess: false,
            isOver: false,
            timeout: null
        }),
        watch: {
            defaultValue(newNum) {
                this.value = newNum;
            }
        },
        created() {
            this.value = parseInt(this.defaultValue, 10);
            if (this.disabled) {
                this.isLess = true;
                this.isOver = true;
            }
        },
        methods: {
            buttonStyle(status) {
                return status.trim() === ''
                    ? { width: `56px`, height: `56px`}
                    : {}
            },
            minusClicked() {
                if (this.disabled) {
                    return;
                }
                const isMinOver = this.value <= this.min;
                const nowNum = this.value - parseInt(this.step, 10);
                if (isMinOver) {
                    this.$emit("stepperValueIsMinOver", { 
                        value: this.value, 
                        isLess: this.isLess, 
                        isOver: this.isOver 
                    }, this.params);
                } else {
                    this.value = nowNum;
                    this.resetDisabledStyle();
                }
                // 由于此处已经减step
                if (nowNum <= this.min) {
                    this.value = parseInt(this.min, 10);
                    this.isLess = true;
                }
                this.$emit("stepperValueChanged", { 
                    value: this.value, 
                    isLess: this.isLess, 
                    isOver: this.isOver 
                }, this.params);
            },
            plusClicked() {
                if (this.disabled) {
                    return;
                }
                const isMaxOver = this.value >= this.max;
                const nowNum = this.value + parseInt(this.step, 10);
                if (isMaxOver) {
                    this.$emit("stepperValueIsMaxOver", { 
                        value: this.value, 
                        isLess: this.isLess, 
                        isOver: this.isOver 
                    }, this.params);
                } else {
                    this.value = nowNum;
                    this.resetDisabledStyle();
                }
                // 由于此处已经加step
                if (nowNum >= this.max) {
                    this.value = parseInt(this.max, 10);
                    this.isOver = true;
                }
                this.$emit("stepperValueChanged", { value: this.value }, this.params);
            },
            onInput(e) {
                this.correctInputValue(e.value);
            },
            onBlur(e) {
                let value = this.value = e.value || e.currentTarget.attr.value
                this.timeout = setTimeout(() => {
                    this.correctInputValue(value);
                    this.isLess = this.value <= parseInt(this.min, 10)
                    this.isOver = this.value >= parseInt(this.max, 10)
                }, 80)
            },
            correctInputValue(v) {
                let min = parseInt(this.min, 10)
                let max = parseInt(this.max, 10)
                if (!/^[0-9]\d{0,}$/.test(v)) {
                    v = min;
                }
                if ((v = parseInt(v, 10)) < min) {
                    this.value = min
                } else if (v > max) {
                    this.value = max;
                } else {
                    this.value = v;
                }
                this.$emit("stepperValueChanged", { value: this.value }, this.params);
            },
            resetDisabledStyle() {
                this.isLess = false;
                this.isOver = false;
            }
        }
    }
</script>
<style>
.stepper {
    flex-direction: row;
}
.stepper-plus,
.stepper-minus {
    width: 56px;
    height: 56px;
    background-color: #ededed;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
}
.stepper-input {
    border-width: 0;
    text-align: center;
    color: #3d3d3d;
    font-size: 30px;
    line-height: 56px;
    width: 86px;
}
.stepper-icon {
    font-size: 36px;
    color: #666666;
}
</style>
