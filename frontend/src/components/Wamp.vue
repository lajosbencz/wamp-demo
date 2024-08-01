<script setup>
import {Connection} from "autobahn";
import {onBeforeUnmount, onMounted, ref} from "vue"

let conn;
let session;

const connected = ref(false);
const count = ref(0);

const increment = async () => {
  if (!conn) {
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
  if (conn) {
    conn.close();
  }
})
</script>

<template>
  <div>
    <span>{{ count }}</span>
    <button @click="increment" :disabled="!connected">i++</button>
  </div>
</template>
