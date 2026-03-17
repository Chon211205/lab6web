const getMessages = async () =>{
    const response = await fetch("/api/messages")
    const messages = await response.json()
    console.log("messages",messages)

    const ul= document.getElementById("messages")
    ul.innerHTML=''

    for(let i =0; i<messages.length;i++){
        const message = messages[i]
        const li =document.createElement('li')
        li.innerHTML=`<strong>${message.user}:</strong> ${message.text}`
        ul.append(li)
    }
}

const postMessages = async (message) =>{
    await fetch("/api/messages", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    }) 
    getMessages()
}

function sendMessage(){
    const textarea = document.getElementById('message')
    const text = textarea.value.trim()

    if(!text) return

    postMessages({
        user: 'chon',
        text: text
    })

    textarea.value = "" // limpiar input
}

document.getElementById('send').addEventListener('click', sendMessage)

document.getElementById('message').addEventListener('keydown', (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
    }
})

getMessages()