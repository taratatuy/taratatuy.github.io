<template>
    <div id="radio">
        <Information />
    </div>
</template>

<script>
    import Information from '../components/Information';
    import $ from 'jquery';
    export default {
        name: 'radio',
        components: {
            Information
        },
        created() {
            $('#Player2').css('display', 'none');
            $('#Player').css('display', 'block');
        }
    };
</script>

<style lang="scss"></style>
