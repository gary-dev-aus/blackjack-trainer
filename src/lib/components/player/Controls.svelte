<script lang="ts">
	import type { Game } from '$lib/game';
	import type { Player } from '$lib/player';
	import { BET_MINIMUM as minBet, BET_MAXIMUM as maxBet } from '$lib/gameConfig';

	export let player: Player;
	export let game: Game;

	const gameState = game.state;
	const playerState = player.state;

	let customBet = minBet;
	const betOptions = [minBet, customBet, maxBet];
	const optionsButton = 'text-left';
</script>

<div class="grid grid-cols-5">
	{#if $playerState === 'playing'}
		<button
			on:click|preventDefault={() => {
				player.hit(game.deck);
				if ($playerState === 'bust' || $playerState === 'blackjack') game.newPlayerTurn(player);
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
	{#if $gameState === 'betting'}
		{#each betOptions as betOption}
			<button
				on:click|preventDefault={() => {
					player.placeBet(betOption);
				}}
				class={optionsButton}
			>
				{betOption}
			</button>
		{/each}
	{/if}
</div>
