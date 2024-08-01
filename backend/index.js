
import {Connection, Session} from 'autobahn'

/**
 * @returns {Promise<{connection: Connection, session: Session}>}
 */
async function wampConnection() {
    return new Promise((resolve, reject) => {
        const connection = new Connection({
            realm: 'default',
            transports: [
                {
                    type: 'rawsocket',
                    host: 'router',
                    port: 8081,
                    protocols: ['wamp.2.msgpack'],
                },
            ],
            on_internal_error: reject,
            on_user_error: reject,
        })
        connection.onopen = async (session) => {
            resolve({connection, session})
        }
        connection.open()
    })
}

const {connection, session} = await wampConnection()


let count = 0

async function rpcCount() {
    count++
    await publishCount()
}

async function publishCount() {
    await session.publish('count', [count], {}, {
        retain: true,
        acknowledge: true,
    })
}

await publishCount()
session.register('count', rpcCount)

process.on('SIGINT', () => {
    console.log('SIGINT received')
    connection.close()
    process.exit(0)
})
