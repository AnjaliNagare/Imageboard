import * as Vue from "./vue.js";
import Modal from "./modal.js";

Vue.createApp({
    components: {
        modal: Modal,
    },

    data() {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            currentImageId: null,
            moreImages:true,
        };
    },

    methods: {
        handleSubmit() {
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
                    console.log(newImage);
                    this.images.unshift(newImage);
                });
        },
        handleFileChange(event) {
            this.file = event.target.files[0];
        },

        onImageClick(image) {
            console.log("App:onImgClick", image);
            this.currentImageId = image.id;
        },
        onCloseButtonClick() {
            console.log("onimageclose");
            this.currentImageId = null;
            history.pushState({}, "", "/");
        },
        onMoreButtonClick() {
            const lastId = this.images[this.images.length - 1].id;
            fetch(`/more-images?limit=3&lastId=`+ lastId)
                .then((response) => response.json())
                .then((moreImages) => {
                    if(!moreImages.length){
                        this.moreImages = false;      
                    }
                    this.images = [...this.images, ...moreImages];
                });
        },
    },

    mounted() {
        const currentID = window.location.hash.slice(1);
        if (currentID) {
            this.currentImageId = currentID;
        }

        window.addEventListener("hashchange", () => {
            console.log(window.location.hash);
            this.currentImageId = window.location.hash.slice(1);
        });

        
        window.addEventListener("popstate", () => {
            console.log(window.location.hash);
            this.currentImageId = location.pathname.slice(1);
        });
        fetch("/images")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.images = data;
            })
            .catch((err) => console.log("error", err));
    },
}).mount("#main");
