<script lang="ts">
  import type { VerifiedRegistrationResponse } from '@simplewebauthn/server';
  import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
  import { invalidateAll } from '$app/navigation';
  import {
    browserSupportsWebAuthnAutofill,
    startAuthentication,
  } from '@simplewebauthn/browser';
  import { browser } from '$app/environment';
  import { loginState } from '$lib/stores/createLoginState.svelte';

  (async () => {
    if (browser && (await browserSupportsWebAuthnAutofill())) {
      const { options } = (await (await fetch(`/api/auth/login`))
        .json()
        .catch((err) => {
          console.error(err);
        })) as { options: PublicKeyCredentialRequestOptionsJSON | null };

      if (!options) return;
      const authenticationResponse = await startAuthentication({
        optionsJSON: options,
        useBrowserAutofill: true,
      });

      loginState.start();
      const verificationJSON: VerifiedRegistrationResponse = await (
        await fetch('/api/auth/login/verify-challenge', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authenticationResponse),
        })
      ).json();

      if (verificationJSON.verified) {
        await invalidateAll();
        loginState.finish();
      } else {
        throw new Error(`Verification failed: ${verificationJSON}`);
      }
    }
  })();
</script>

<input
  type="text"
  name="username"
  autocomplete="username webauthn"
  placeholder="ユーザー名"
  disabled={loginState.isProcessing}
/>
