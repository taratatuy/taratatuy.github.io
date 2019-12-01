<template>
  <transition class="model" name="modal">
    <div class="modal__mask">
      <div class="modal__wrapper">
        <div class="modal__container">
          <div class="modal__header">
            <p>Введите новый пароль</p>
          </div>
          <input class="modal__body" type="password" v-model="password"/>
          <div class="modal__footer">
            <div class="modal__default-button" @click="$emit('close')">
              Отмена
            </div>
            <div class="modal__default-button" @click="$emit('change-pass', password); $emit('close')">
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
  name: 'NewPassword',
  data() {
    return {
      password: ''
    }
  }
}
</script>