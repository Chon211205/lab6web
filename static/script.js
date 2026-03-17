const getMessages = async () =>{
        const response = await fetch("/api/messages")
        const messages = await response.json()
        console.log("messages",messages)
        const ul= document.getElementById("messages")
        ul.innerHTML=''
        for(let i =0; i<messages.length;i++){
            const message = messages[i]
            const li =document.createElement('li')
            li.innerHTML=`<strong> ${message.user}:</strong> ${message.text}`
            console.log("message",message)
            ul.append(li)
        }
    }

    const postMessages = async (message) =>{
        await fetch("/api/messages", {
            method: 'POST', body: JSON.stringify(message) }) 
            getMessages()

    }

    getMessages()

    document.getElementById('send').addEventListener('click', () => {
        const message = document.getElementById('message').value
        postMessages({
        user: 'user',
        text: message
        })
    }
)