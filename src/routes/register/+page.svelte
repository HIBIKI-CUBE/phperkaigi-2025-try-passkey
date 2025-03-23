<script lang='ts'>
  import type { VerifiedRegistrationResponse } from '@simplewebauthn/server';
  import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';
  import { goto, invalidateAll } from '$app/navigation';
  import { startRegistration } from '@simplewebauthn/browser';

  let username = $state('');
  let isProcessing = $state(false);

  async function createPasskey() {
    if (username === '') {
      return;
    }
    isProcessing = true;
    const { options } = await (await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username }),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })).json().catch((err) => {
      console.error(err);
    }) as { options: PublicKeyCredentialCreationOptionsJSON | null };
    if (!options)
      return;
    const registrationResponse = await startRegistration({ optionsJSON: options });

    const verificationJSON: VerifiedRegistrationResponse = await (await fetch('/api/auth/register/verify-challenge', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationResponse),
    })).json();

    if (verificationJSON.verified) {
      await invalidateAll();
      isProcessing = false;
      goto('/');
    }
  }
</script>

<section>
  <h2>パスキーの新規登録</h2>
  <article data-budoux>
    <p>このページではパスキーを新しく作成できます。</p>
    <p>アカウントを識別できるようにするために、ユーザー名を入力した上で登録ボタンを押してください。</p>
  </article>
  <form action="" onsubmit={createPasskey}>
    <label>ユーザー名
      <input type='text' autocomplete="username" required bind:value={username}>
    </label>
    {#if isProcessing}
      <button disabled>処理中…</button>
    {:else}
      <button onclick={createPasskey} disabled={username === ''}>登録</button>
    {/if}
  </form>
  <a href="/">トップに戻る</a>
</section>

<style lang="scss">
  form{
    margin-block: 1em;
  }
</style>
