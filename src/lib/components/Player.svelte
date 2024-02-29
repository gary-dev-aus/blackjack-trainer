<script lang="ts">
	import type { Game } from '$lib/game';
	import type { Player } from '$lib/player';

	export let player: Player;
	export let game: Game;

	const cards = player.hand.cards;
	const value = player.hand.value;
	const state = player.state;

	const optionsButton = 'text-left';
</script>

<div>
	<p>{player.name}</p>
	<div class="flex flex-row space-x-2">
		<p>Value: {$value}</p>
		{#if $state === 'bust'}
			<p>Bust!</p>
		{:else if $state === 'blackjack'}
			<p>Blackjack!</p>
		{/if}
	</div>
	<div class="grid grid-cols-5">
		{#each $cards as card}
			<div>
				{card.toShortName('string')}
			</div>
		{/each}
	</div>
	<div class="grid grid-cols-5">
		{#if $state === 'active'}
			<button
				on:click|preventDefault={() => {
					player.hit(game.deck);
					if ($state === 'bust' || $state === 'blackjack') game.newPlayerTurn(player);
				}}
				class={optionsButton}
			>
				Hit
			</button>
			<button
				on:click|preventDefault={() => {
					player.stand();
					game.newPlayerTurn(player);
				}}
				class={optionsButton}
			>
				Stand
			</button>
		{/if}
	</div>
</div>
