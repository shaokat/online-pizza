import axios from "axios"
import Noty from "noty"
const addToCart = document.querySelectorAll('.add-to-cart')
const cartCounter = document.querySelector('#cartCounter')

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