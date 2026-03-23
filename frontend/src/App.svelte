<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from './assets/vite.svg'
  import heroImg from './assets/hero.png'
  import Counter from './lib/Counter.svelte'
  import { Router, Link, Route } from "svelte-routing";

  export let url = "";
</script>


<nav>
  <Router {url}>
    <Route path="/" component=""/>
  </Router>
</nav>
