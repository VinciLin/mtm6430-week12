<template>
    <div>
        <h1>Dashboard</h1>
        <h2>Welcome to your dashboard</h2>
        <p>Your login name is : {{ user.name }}</p>
        <p>Your login email is: {{ user.email }}</p>
        <form @submit.prevent="submitForm">
            <label for="name">Edit your name:</label>
            <input type="text" id="name" v-model="user.name"/>
            <br/>
            <input type="submit" value="Submit">
        </form>
    </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            userData: "getUser"
        }),
        user(){
            return !this.userData ? false : this.userData
        }
    },

    created(){
        // get the getUserDate method
        this.getUserData();
    },
    methods: {
        ...mapActions(["fetchUser","updateUser"]),
        getUserData(){
            // get email
            let userEmail = localStorage.getItem("userEmail");
            // fetch the email
            this.fetchUser(userEmail)
        },
        submitForm(){
            this.updateUser();
        }
    },

}
</script>