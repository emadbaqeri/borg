import Libp2p from 'libp2p';
import Bootstrap from 'libp2p-bootstrap';
import WebRTCDirect from 'libp2p-webrtc-direct';
import Mplex from 'libp2p-mplex';
import { NOISE } from 'libp2p-noise';

document.addEventListener('DOMContentLoaded', async () => {
    // use the same peer id as in `listener.js` to avoid copy-pasting of listener's peer id into `peerDiscovery`
    const hardcodedPeerId = '12D3KooWP9j4Cp8hEbMMxLuKYZ8RvXuBi81QneULrawgRo8HTD3x'
    const libp2p = await Libp2p.create({
      modules: {
        transport: [WebRTCDirect],
        streamMuxer: [Mplex],
        connEncryption: [NOISE],
        peerDiscovery: [Bootstrap]
      },
      config: {
        peerDiscovery: {
          [Bootstrap.tag]: {
            enabled: true,
            list: [`/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct/p2p/${hardcodedPeerId}`]
          }
        }
      }
    })
  
    const status = document.getElementById('status')
    const output = document.getElementById('output')
  
    output.textContent = ''
  
    function log (txt) {
      console.info(txt)
      output.textContent += `${txt.trim()}\n`
    }
  
    // Listen for new peers
    libp2p.on('peer:discovery', (peerId) => {
      log(`Found peer ${peerId.toB58String()}`)
    })
  
    // Listen for new connections to peers
    libp2p.connectionManager.on('peer:connect', (connection) => {
      log(`Connected to ${connection.remotePeer.toB58String()}`)
    })
  
    // Listen for peers disconnecting
    libp2p.connectionManager.on('peer:disconnect', (connection) => {
      log(`Disconnected from ${connection.remotePeer.toB58String()}`)
    })
  
    await libp2p.start()
    status.innerText = 'libp2p started!'
    log(`libp2p id is ${libp2p.peerId.toB58String()}`)
  
  })
