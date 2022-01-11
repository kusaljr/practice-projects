import axios from 'axios'
import noty from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
function updateCart(item){
    axios.post('/update-cart', item).then(res =>{
        cartCounter.innerText = res.data.totalQty
        console.log(res.data)
        new noty({
            type:'success',
            timeout:1000,
            text: `Item added to cart`,
            progressBar:false
        }).show()
    }).catch(err=>{
        new noty({
            type:'error',
            timeout:1000,
            text: `Error`,
            progressBar:false
        }).show()

    })

}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let item = JSON.parse(btn.dataset.item)
        updateCart(item)
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    }, 2000)
}

initAdmin()

//change order status

// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm:A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order)


//socket
let socket = io()
if(order){
    socket.emit('join',`order_${order._id}`)
}
socket.on('orderUpdated',()=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
      type: 'success',
      timeout: 1000,
      text: 'Order Updated',
      progressBar: false  
    }).show()

})
