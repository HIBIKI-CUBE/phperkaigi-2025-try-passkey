<script lang="ts">
  import type { PageProps } from './$types';
  import AuthButton from '$lib/components/AuthButton.svelte';
  import { enhance } from '$app/forms';
  import AuthForm from '$lib/components/AuthForm.svelte';

  const { data }: PageProps = $props();

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}Z`);
    const { format } = new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'Asia/Tokyo',
    });

    return format(date);
  };

  let commentInput = $state('');
</script>

<article>
  <section>
    <h2>パスキーのデモ</h2>
    <article>
      <p data-budoux>
        このサイト全体でパスキーによる認証が使えるようになっています。
      </p>
      {#if data.user}
        {@const user = data.user}
        <p>{user.name}さん、こんにちは！</p>
        <p>無事にパスキーでログインできました。</p>
        <p data-budoux>
          新しくパスキーを作りたければ
          <a href="/register">パスキー登録ページ</a>
          へどうぞ。
        </p>
        <p>
          ログアウトするには <ruby>
            <AuthButton {user} /> <rp>(</rp><rt>ログアウトボタン</rt><rp>)</rp>
          </ruby>
          を押してください
        </p>
      {:else}
        <p data-budoux>
          まずは
          <a href="/register">パスキー登録ページ</a>
          から新しくパスキーを作ってください。
        </p>
        <p>
          パスキーを使ってログインするには
          <ruby>
            <AuthForm />
            <rp>(</rp><rt>ユーザー名入力欄</rt><rp>)</rp>
          </ruby>
          にフォーカスするか、
          <ruby>
            <AuthButton />
            <rp>(</rp><rt>ログインボタン</rt><rp>)</rp>
          </ruby>
          を押してください
        </p>
      {/if}
    </article>
  </section>

  <section>
    <h2>スライド</h2>
    <iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/e25f6c83e6cb40a8a0036c640a5f62c2" title="パスキーでのログインを 実装してみよう！" allowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>
  </section>

  <section class="comments">
    <h2>コメント欄</h2>
    <p data-budoux>
      パスキーでログインをするとここにコメントを残していけるようになります。
    </p>
    <p class="kome" data-budoux>
      このコメント欄は、ログインを必要とする機能が動作していることを確認する目的で提供しています。機密情報や個人情報、誹謗中傷などを書き込まないでください。
    </p>
    <section data-budoux>
      {#each data.comments as comment}
        <div class="comment">
          {comment.owner.name}:
          <span>{comment.content}</span>
          {formatDate(comment.created_at)}
        </div>
      {/each}
    </section>
    <form method="POST" use:enhance>
      <label>
        コメント
        <input
          type="text"
          name="comment"
          disabled={!data.user}
          bind:value={commentInput}
        />
      </label>
      <button disabled={!data.user || !commentInput}>送信</button>
    </form>
  </section>
</article>

<style lang="scss">
  ruby {
    ruby-align: center;
    rt {
      margin-block: 0.25em;
    }
  }

  section {
    iframe {
      width: 100%;
      height: auto;
      aspect-ratio: 1440 / 839;
      margin-block: 0.5em;
    }
  }

  .comments {
    margin-block: 1em;
    .kome {
      padding-left: 2ch;
      position: relative;
      &::before {
        content: '※';
        position: absolute;
        left: 0;
      }
    }
    form {
      display: flex;
      label {
        flex: auto;
        display: flex;
        input {
          flex: auto;
          margin-inline: 1em;
        }
      }
    }
    .comment {
      display: flex;
      margin-block: 0.5em;
      span {
        flex: auto;
      }
    }
  }
</style>
