const CommentsList = {
    props: ["id"],
    data() {
        return {
            username: "",
            text: "",
            comments: [],
        };
    },
    mounted() {
        fetch(`/images/${this.id}/comments`)
            .then((response) => response.json())
            .then((comments) => {
                this.comments = comments;
            });
    },

    methods: {
        onFormSubmit(event) {
            event.preventDefault();
            fetch(`/images/${this.id}/comments`, {
                method: "POST",
                body: JSON.stringify({
                    text: this.text,
                    username: this.username,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((newComment) => {
                    console.log(newComment);
                    this.comments.push(newComment);
                })
                .catch((error) => console.log("error", error));
        },
    },

    template: `
    <div class="comments">
        <h2>Commments!</h2>
        <div v-for="comment in comments">{{comment.username}} commented-{{comment.text}}</div>
        <form v-on:submit="onFormSubmit">
            <input name="username" 
            type="text"
            v-model="username" 
            placeholder="username">
            <input name="text"
            type='text' 
            v-model="text" 
            placeholder="Add Comment">
            <button>comment</button>
        </form>
    </div>
    `,
};


export default CommentsList;