<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title
    >パスキーでのログインを実装してみよう！ by HIBIKI CUBE @ PHPerKaigi 2025</title
  >
</svelte:head>

<main>
  <h1 data-budoux>パスキーでのログインを実装してみよう！</h1>
  <h2 data-budoux>by HIBIKI CUBE @ PHPerKaigi 2025</h2>
  {@render children?.()}
</main>

<style lang="scss">
  :global(html, body) {
    background: #f2f9ff;
    margin: 0;
  }

  main {
    width: 100%;
    max-width: calc(min(90%, 800px));
    margin: 0 auto;

    h1 {
      color: #1e88e5;
    }
    h2 {
      color: #0b6bbe;
    }

    :global {
      p {
        margin-block: 0.25em;
      }

      section:has(h2) {
        background: #fff;
        border-radius: 1em;
        position: relative;
        padding: 1em 2em;
        padding-top: 1.5em;
        margin-block: 2em;
        width: 100%;
        box-sizing: border-box;
        h2 {
          position: absolute;
          margin: 0;
          font-size: 1.5em;
          top: calc(1.5em / -2);
          color: #1e88e5;
          background: #fff;
          padding: 0.25em 0.75em 0;
          border-radius: 1em;
        }
      }
    }
  }
</style>
