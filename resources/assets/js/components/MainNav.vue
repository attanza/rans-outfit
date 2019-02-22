<template>
  <div>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" fixed app>
      <v-toolbar flat color="primary" dark>
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content v-if="!mini">
              <img width="50%" style="margin-left: -10px;">
            </v-list-tile-content>
            <v-list-tile-avatar v-if="mini">
              <img>
            </v-list-tile-avatar>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <div v-for="(item, i) in items" :key="i">
          <v-list-tile v-if="!item.hasChild" :href="item.to">
            <v-list-tile-action>
              <v-icon v-html="item.icon"/>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group v-if="item.hasChild" :prepend-icon="item.icon" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="(item, i) in item.children" :key="i" :href="item.to">
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon v-html="item.icon"/>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app color="primary" dark flat>
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-spacer/>
      <v-toolbar-items>
        <v-menu origin="center center" transition="scale-transition" bottom>
          <v-btn slot="activator" icon large>
            <v-avatar>
              <img src="/images/user.png">
            </v-avatar>
          </v-btn>
          <v-list>
            <v-list-tile avatar color="primary">
              <v-list-tile-avatar>
                <v-img src="/images/user.png" aspect-ratio="1"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <!-- <v-list-tile-title v-html="user.name"/>
                <v-list-tile-sub-title v-html="user.email"/>-->
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile
              v-for="(item, index) in righItems"
              :key="index"
              @click="itemActions(item.title)"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { LOGOUT_URL } from "../utils/apis";
import catchError, { showNoty } from "../utils/catchError";
import { adminItems } from "./menu";

export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      items: null,
      mini: false,
      right: true,
      rightDrawer: false,
      title: "Langsung Jalan",
      righItems: [
        // { title: "Profile", icon: "account_box" },
        { title: "Logout", icon: "exit_to_app" }
      ]
    };
  },
  mounted() {
    this.setMenus();
  },
  methods: {
    setMenus() {
      this.items = adminItems;
    },
    async logout() {
      try {
        const resp = await axios.post(LOGOUT_URL).then(res => res.data);
        if (resp.data) {
          window.location.replace("/");
        }
      } catch (e) {
        showNoty("Login failed", "error");
      }
    },
    toProfile() {
      this.$router.push("/profile");
    },
    itemActions(title) {
      switch (title) {
        case "Logout":
          this.logout();
          break;
        case "Profile":
          this.toProfile();
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
</style>
