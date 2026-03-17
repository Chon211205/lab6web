package main

import (
	"fmt"
	"io"
	"net/http"
)

var chatapi = "https://chat.joelsiervas.online"

func getMessage(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(chatapi + "/messages")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	io.Copy(w, resp.Body)
}

func postMessage(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Post(chatapi+"/messages", "application/json", r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	io.Copy(w, resp.Body)
}

func main() {

	http.Handle("/", http.FileServer(http.Dir("static")))


	http.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			getMessage(w, r)
			return
		}
		if r.Method == "POST" {
			postMessage(w, r)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	fmt.Println("Servidor corriendo en http://localhost:8000")
	http.ListenAndServe("0.0.0.0:8000", nil)
}