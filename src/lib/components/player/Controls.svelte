<script lang="ts">
	import type { Game } from '$lib/game';
	import type { Player } from '$lib/player';
	import { BET_MINIMUM as minBet, BET_MAXIMUM as maxBet } from '$lib/gameConfig';

	export let player: Player;
	export let game: Game;

	const playerState = player.state;

	let customBet = minBet;

	// Prevent non numeric in customBet
	function onKeydown(event: KeyboardEvent) {
		if (isNaN(parseInt(event.key)) && event.key !== 'Backspace') event.preventDefault();
	}

	// Styles
	const optionsButton = 'text-left';
	const grid = 'grid grid-cols-5 gap-4';
	const error = 'text-red-500';
</script>

<div>
	{#if $playerState === 'playing'}
		<div class={grid}>
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
		</div>
	{/if}
	{#if $playerState === 'betting'}
		<div class={grid}>
			<p>Bet:</p>
			<button
				on:click|preventDefault={() => {
					player.placeBet(minBet);
					game.newPlayerTurn(player);
				}}
				class={optionsButton}
			>
				{minBet}
			</button>
			<button
				on:click|preventDefault={() => {
					player.placeBet(customBet);
					game.newPlayerTurn(player);
				}}
				disabled={customBet < minBet || customBet > maxBet}
			>
				{customBet}
			</button>
			<button
				on:click|preventDefault={() => {
					player.placeBet(maxBet);
					game.newPlayerTurn(player);
				}}
				class={optionsButton}
			>
				{maxBet}
			</button>
		</div>
		<p>Customise bet:</p>
		<input
			type="number"
			title="Numbers only"
			on:keydown={onKeydown}
			bind:value={customBet}
			min={minBet}
			max={maxBet}
		/>
		<input type="range" bind:value={customBet} min={minBet} max={maxBet} class="mt-1" />
		{#if customBet < minBet}
			<p class={error}>Below minimum bet.</p>
		{:else if customBet > maxBet}
			<p class={error}>Above maximum bet.</p>
		{/if}
	{/if}
</div>
