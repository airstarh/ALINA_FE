<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" class="fixed-top">
            <b-navbar-brand to="/">¯\_(ツ)_/¯</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item to="/about">About</b-nav-item>
                    <b-nav-item to="/RestCall">RestCall</b-nav-item>
                    <b-nav-item to="/auth/login">LogIn</b-nav-item>
                    <b-nav-item to="/auth/logout">LogOut</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <!--<b-nav-form>-->
                    <!--    <b-form-input-->
                    <!--            size="sm"-->
                    <!--            class="mr-sm-2"-->
                    <!--            placeholder="Search"-->
                    <!--    ></b-form-input>-->
                    <!--    <b-button size="sm" class="my-2 my-sm-0" type="submit"-->
                    <!--    >Search-->
                    <!--    </b-button-->
                    <!--    >-->
                    <!--</b-nav-form>-->

                    <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template slot="button-content">
                            <em>{{this.CU.name()}}</em>
                        </template>
                        <b-dropdown-item to="/auth/login" v-if="!CU.isLoggedIn()">LogIn</b-dropdown-item>
                        <b-dropdown-item to="/auth/reset_password_request" v-if="!CU.isLoggedIn()">Reset password request</b-dropdown-item>
                        <b-dropdown-item to="/auth/reset_password_with_code" v-if="!CU.isLoggedIn()">Reset password with code</b-dropdown-item>
                        <b-dropdown-item to="/auth/profile" v-if="CU.isLoggedIn()">Profile</b-dropdown-item>
                        <b-dropdown-item to="/auth/change_password" v-if="CU.isLoggedIn()">Change password</b-dropdown-item>
                        <b-dropdown-item to="/auth/logout" v-if="CU.isLoggedIn()">LogOut</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
    import CurrentUser from "@/services/CurrentUser";

    export default {
        name:  "MenuHorizontalMain",
        data() {
            return {
                CU: CurrentUser.obj(),
            }
        },
        watch: {
            "CU": function (v) {
                console.log(">>>____________________________");
                console.log("v");
                console.log(v);
                console.log("<<<____________________________");
            }
        }
    };
</script>
