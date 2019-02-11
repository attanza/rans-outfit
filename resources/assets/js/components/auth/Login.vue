<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm6>
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Welcome</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-validate="'required|email'"
                    v-model="email"
                    :error-messages="errors.collect('email')"
                    name="login"
                    data-vv-name="email"
                    data-vv-as="Email"
                    prepend-icon="mail"
                    label="Your email address"
                  />
                  <v-text-field
                    v-validate="'required'"
                    v-model="password"
                    :error-messages="errors.collect('password')"
                    data-vv-name="password"
                    data-vv-as="Password"
                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    @click:append="show1 = !show1"
                    prepend-icon="lock"
                    label="Your password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="submit" color="primary" dark>Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { LOGIN_URL } from "../../utils/apis";
import catchError, { showNoty } from "../../utils/catchError";
import { global } from "../../mixins";
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  data: () => ({
    email: "administrator@ransoutfit.com",
    password: "password",
    show1: false
  }),
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.postLogin();
          return;
        }
      });
    },
    async postLogin() {
      try {
        this.activateLoader();
        const postData = {
          email: this.email,
          password: this.password
        };

        const resp = await axios
          .post(LOGIN_URL, postData)
          .then(res => res.data);
        if (resp.data) {
          window.location.replace("/admin");
        }
        this.deactivateLoader();
      } catch (e) {
        console.log("e", e);

        this.deactivateLoader();
        showNoty("Login failed", "error");
      }
    }
  }
};
</script>