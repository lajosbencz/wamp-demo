<script setup>
import {Connection} from "autobahn";
import HelloWorld from './components/HelloWorld.vue'
import {onBeforeUnmount, onMounted, ref} from "vue";

let conn;
let session;

const connected = ref(false);
const count = ref(0);

const increment = async () => {
  if(!conn) {
    throw new Error('WAMP connection is not established')
  }
  await session.call('count')
  console.log('rpc called')
}

onMounted(() => {
  conn = new Connection({
    url: "/ws/",
    realm: "default",
    use_es6_promises: true,
  });

  conn.onopen = async (s) => {
    console.log('opened wamp')
    session = s
    connected.value = true
    await session.subscribe('count', ([c]) => {
      count.value = c
      console.log('event received')
    }, {
      acknowledge: true,
      get_retained: true,
    })
  }

  conn.onclose = () => {
    connected.value = false
  }

  conn.open()
  console.log('opening wamp')
})

onBeforeUnmount(() => {
  if(conn) {
    conn.close();
  }
})

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div>
    <span>{{ count }}</span>
    <button @click="increment" :disabled="!connected">i++</button>
  </div>
<!--  <HelloWorld msg="Vite + Vue" />-->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
