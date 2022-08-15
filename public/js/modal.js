import CommentsList from "./comments-list.js";

const Modal = {
    props: ["id"],
    components: {
        "comments-list": CommentsList,
    },
    data() {
        return {
            title: "",
            username: "",
            description: "",
            url: "",
        };
    },

    methods: {
        onCloseButtonClick() {
            this.$emit("close");
        },
    },
    mounted() {
        console.log("Modal", this.id);
        fetch(`/images/${this.id}`)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                this.title = response.title;
                this.username = response.username;
                this.description = response.description;
                this.url = response.url;
            });
    },
    template: `<div class='modal-overlay'>
        <div class='modal'>
        <button class="close-button" v-on:click="onCloseButtonClick"><strong>X</strong></button>
        <img v-bind:src="url"/>
        <div class="image-info">
        <p> {{title}} </p>
        <p> {{description}} </p>
        <p>posted by {{username}}</p>
        </div>
        <comments-list :id="id"></comments-list>
        </div>
    </div>    
        `,
};

export default Modal;
