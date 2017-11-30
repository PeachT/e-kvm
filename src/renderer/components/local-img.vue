<template>
  <div>
    <img v-focus :alt="alt">
  </div>
</template>

<script>
  export default {
    name: 'locakImg',
    props: ['src', 'alt'],
    directives: {
      focus: {
        // 指令的定义
        inserted: (el) => {
          console.log('1231231', el);
          el.src = 'E:\\KVM\\Electron\\kvm0.0.0\\src\\renderer\\assets\\logo.png';
        },
      },
    },
  };
</script>
