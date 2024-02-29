<script lang="ts">
	import type { Player } from '$lib/player';

	export let player: Player;

	const playerState = player.state;
	const value = player.state;
	const chips = player.chips;
	const bet = player.bet;

	const detailsClass = 'flex flex-row space-x-2';
</script>

<p>{player.name}</p>
<div class={detailsClass}>
	<p>Value: {$value}</p>
	{#if $playerState === 'bust'}
		<p>Bust!</p>
	{:else if $playerState === 'blackjack'}
		<p>Blackjack!</p>
	{/if}
</div>
<div class={detailsClass}>
	<p>Chips: {$chips}</p>
	{#if $bet === null}
		<p>No bet</p>
	{:else if $bet?.amount >= 0}
		<p>Bet: {$bet?.amount}</p>
	{/if}
</div>
