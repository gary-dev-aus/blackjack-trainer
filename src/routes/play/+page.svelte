<script lang="ts">
	import Player from '$lib/components/player/Player.svelte';
	import { Game } from '$lib/game';
	import { DECKS } from '$lib/gameConfig';

	const game = new Game(3, DECKS);
	const gameState = game.state;
	const players = game.players;
	const deck = game.deck;
</script>

<h1>blackjack trainer</h1>
<div>
	{#if $gameState === 'initial'}
		<button on:click|preventDefault={() => game.startNewGame()}> start game </button>
	{:else if $gameState === 'roundEnd'}
		<button> new round </button>
	{/if}
</div>
<div>
	<p>Deck: {$deck.length}</p>
</div>
<div class="flex flex-col">
	<h2>players</h2>
	<div class="grid grid-cols-4">
		{#each players as player}
			<Player {player} {game} />
		{/each}
	</div>
</div>
