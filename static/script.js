// Por colocar el campo de texto para escribir el mensaje en la parte inferior de la pantalla (no debe ocultarse cuando hay muchos mensajes)
document.body.style.margin = "0"
document.body.style.display = "flex"
document.body.style.flexDirection = "column"
document.body.style.height = "100vh"

const ul = document.getElementById("messages")
ul.style.flex = "1"
ul.style.overflowY = "auto"
ul.style.listStyle = "none"
ul.style.padding = "10px"

const footer = document.querySelector("footer")
footer.style.display = "flex"
footer.style.padding = "10px"
footer.style.background = "#222"
footer.style.position = "sticky"
footer.style.bottom = "0"

const textarea = document.getElementById("message")

//contador en vivo de 140 maximo.
const counter = document.createElement("div")
counter.textContent = "0/140"
counter.style.color = "white"
counter.style.fontSize = "12px"
counter.style.marginBottom = "5px"

footer.insertBefore(counter, textarea)

textarea.addEventListener("input", () => {
    const length = textarea.value.length
    counter.textContent = `${length}/140`

    if(length > 120){
        counter.style.color = "orange"
    } else {
        counter.style.color = "white"
    }
})

textarea.style.flex = "1"
textarea.style.padding = "10px"
textarea.style.borderRadius = "10px"


const button = document.getElementById("send")
button.style.marginLeft = "10px"
button.style.padding = "10px"
button.style.borderRadius = "10px"
button.style.background = "#22c55e"
button.style.color = "white"

//Por agregar hacer "submit" del mensaje utilizando "Enter" 
//Por preservar el scroll después de recibir nuevos mensajes
const getMessages = async () => {
    const ul = document.getElementById("messages")
    const isAtBottom = ul.scrollTop + ul.clientHeight >= ul.scrollHeight - 5

    const response = await fetch("/api/messages")
    const messages = await response.json()

    ul.innerHTML = ''

    for(let i = 0; i < messages.length; i++){
        const message = messages[i]
        const li = document.createElement('li')

        const text = message.text

        const isImage = text.match(/\.(jpeg|jpg|gif|png|webp)$/i)

        const isLink = text.startsWith("http")

        let content = `<strong>${message.user}:</strong> ${text}`

        if (isImage) {
            content += `
                <br>
                <img src="${text}" style="
                    max-width:200px;
                    border-radius:10px;
                    margin-top:5px;
                ">
            `
        }

        else if (isLink) {
            content += `
                <div style="
                    margin-top:8px;
                    padding:10px;
                    border-radius:10px;
                    background:#1e293b;
                    border-left:4px solid #22c55e;
                ">
                    <a href="${text}" target="_blank" style="
                        color:#22c55e;
                        text-decoration:none;
                        font-weight:bold;
                    ">
                        Abrir enlace
                    </a>
                </div>
            `
        }

        li.innerHTML = content
        ul.append(li)
    }

    if (isAtBottom) {
        ul.scrollTop = ul.scrollHeight
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

//contador en vivo de 140 maximo.
function sendMessage(){
    const textarea = document.getElementById('message')
    const text = textarea.value.trim()

    if(!text) return

    if(text.length > 140){
        alert("Máximo 140 caracteres")
        return
    }

    postMessages({
        user: 'chon',
        text: text
    })

    textarea.value = ""
    counter.textContent = "0/140"
}

document.getElementById('send').addEventListener('click', sendMessage)

document.getElementById('message').addEventListener('keydown', (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
    }
})

getMessages()
//Auto-refresh de la lista de mensajes
setInterval(getMessages, 2000)