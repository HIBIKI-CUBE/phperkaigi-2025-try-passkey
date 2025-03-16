<script lang="ts">
  import type { PageProps } from './$types';
  import AuthButton from '$lib/components/AuthButton.svelte';
  import { date } from 'drizzle-orm/mysql-core';

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
          パスキーを使ってログインするには <ruby>
            <AuthButton user={data.user} /> <rp>(</rp><rt>ログインボタン</rt><rp
              >)</rp
            >
          </ruby>
          を押してください
        </p>
      {/if}
    </article>
  </section>

  <section class="comments" data-budoux>
    <h2>コメント欄</h2>
    <p>
      パスキーでログインをするとここにコメントを残していけるようになります。
    </p>
    <p class="kome">
      このコメント欄は、ログインを必要とする機能が動作していることを確認する目的で提供しています。機密情報や個人情報、誹謗中傷などを書き込まないでください。
    </p>
    <section>
      {#each data.comments as comment}
        <div class="comment">
          {comment.owner.name}:
          <span>{comment.content}</span>
          {formatDate(comment.created_at)}
        </div>
      {/each}
    </section>
    <form method="POST">
      <label>
        コメント
        <input type="text" name="comment" />
      </label>
      <button>送信</button>
    </form>
  </section>
</article>

<style lang="scss">
  rt {
    margin-bottom: 0.5em;
  }

  .comments {
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
    .comment{
      display: flex;
      span {
        flex: auto;
      }
    }
  }
</style>
