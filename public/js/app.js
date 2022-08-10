import * as Vue from './vue.js';

Vue.createApp({
    data(){
        return{
            images:[],
        };
    },
    methods:{},
    mounted(){
        fetch('/images')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.images = data;
            });
    },
}).mount('#main');