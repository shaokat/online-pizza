import axios from "axios"
import moment from "moment"
import Noty from "noty"
import {initAdmin} from "./admin"
const addToCart = document.querySelectorAll('.add-to-cart')
const cartCounter = document.querySelector('#cartCounter')

//Socket

let socket = io()

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res=>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar:false,
            layout: 'topLeft'
        }).show()
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Someting went wrong!',
            progressBar:false,
            layout: 'topLeft'
        }).show()
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

//Remove alert message after x seconds

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    }, 2000)
}

//admin order js
initAdmin(socket)

//Change order status
let statuess = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput? hiddenInput.value : null
order = JSON.parse(order )
let time = document.createElement('small')

function updateStatus(order){
    statuess.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')

    })
    let stepCompleted = true
    statuess.forEach((status)=>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }

        if(dataProp === order.status){
            stepCompleted=false
            time.innerText = moment(order.updatedAt).format('hh:mm:A')
            status.appendChild(time)
            if( status.nextElementSibling){
                status.nextElementSibling.classList.add('current')

            }
            
        }
    })
}

updateStatus(order);

//join
if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
console.log(adminAreaPath)

if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data)=>{
    const updateOrder = { ...order }
    updateOrder.updatedAt = moment().format()
    updateOrder.status = data.status
    updateStatus(updateOrder)
    new Noty({
        type: 'success',
        timeout:1000,
        text: 'Order updated',
        progressBar: false
    }).show();
})
