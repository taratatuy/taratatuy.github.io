<template>
  <transition class="model" name="modal">
    <div class="modal__mask">
      <div class="modal__wrapper">
        <div class="modal__container">
          <div class="modal__header">
            <p>Введите новый email</p>
          </div>
          <input class="modal__body" type="email" v-model="email"/>
          <div class="modal__footer">
            <div class="modal__default-button" @click="$emit('close')">
              Отмена
            </div>
            <div class="modal__default-button" @click="$emit('change-email', email); $emit('close')">
              Принять
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    name: 'NewEmail',
    data() {
        return {
            email: ''
        }
    }
}
</script>

<style lang="scss">
@import '../variables';
.modal {
  &__mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    display: table;
    transition: opacity .3s ease;
  }

  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &__container {
    width: 300px;
    height: 280px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: $Thoroddsenjökull-1-hex;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  &__header p {
    text-transform: uppercase;
    margin: 10px auto;
    font-size: 18px;
  }

  &__body {
    background: $Thoroddsenjökull-2-hex;
    border: none;
    color: $Thoroddsenjökull-4-hex;
    padding-left: 15px;
    height: 40px;
    width: 100%;
    font-size: 18px;
    margin: 10px auto;
  }

  &__default-button {
    width: 240px;
    height: 40px;
    margin: 16px auto;
    border-radius: 134px;
    border: 1px solid $Thoroddsenjökull-4-hex;
    line-height: 2.2;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: $Thoroddsenjökull-2-hex;
      border-color: $Thoroddsenjökull-2-hex;
    }
  }
}
</style>