import * as Vue from './vue.js';

Vue.createApp({
    data(){
        return{
            images:[],
            title: "",
            username: "",
            description:"",
        };
    },

    mounted(){
        fetch("/images")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.images = data;
            })
            .catch((err) => console.log("error", err));
    },
    methods: {
        handleSubmit: function (event) {
            event.preventDefault();
            console.log("handle submit...");
            console.log("this.title: ", this.title);

            const formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);


            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((newImage) => {
                    this.images.unshift(newImage);
                });
        },
        handleFileChange(event) {
            this.file = event.target.files[0];
        },
    },
}).mount('#main');