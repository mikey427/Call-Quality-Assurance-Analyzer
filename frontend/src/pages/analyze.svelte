<script lang="ts">
	let dragging = $state(false)
	let fileName = $state<string | null>(null)

	const pluses = [
		"Agent greeted the caller warmly and used their name throughout the call.",
		"Issue was resolved within the first contact, no callback required.",
		"Clear and concise explanation of the resolution steps provided.",
	]

	const minuses = [
		"Hold time exceeded 3 minutes without a courtesy check-in.",
		"Closing statement did not include a satisfaction confirmation.",
	]

	const scorecard = [
		{ label: "Greeting & Introduction", score: 9 },
		{ label: "Active Listening", score: 7 },
		{ label: "Problem Resolution", score: 8 },
		{ label: "Communication Clarity", score: 8 },
		{ label: "Empathy & Tone", score: 6 },
		{ label: "Call Closing", score: 5 },
	]

	const overallScore = Math.round(scorecard.reduce((a, b) => a + b.score, 0) / scorecard.length)
</script>

<div class="min-h-screen bg-zinc-950 text-zinc-200 p-8">
	<div class="max-w-3xl mx-auto flex flex-col gap-8">

		<!-- Page header -->
		<div>
			<h1 class="text-2xl font-semibold text-zinc-100">Analyze a Call</h1>
			<p class="mt-1 text-sm text-zinc-500">Upload a call recording or transcript to get an AI-powered quality review.</p>
		</div>

		<!-- Instructions -->
		<section class="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
			<h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">How it works</h2>
			<ol class="flex flex-col gap-2">
				{#each [
					"Upload an audio file (.mp3, .wav, .m4a) or a plain-text transcript (.txt).",
					"The AI will transcribe and review the call against quality standards.",
					"Review the summary, highlights, and scorecard below."
				] as step, i}
					<li class="flex items-start gap-3 text-sm text-zinc-400">
						<span class="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
						{step}
					</li>
				{/each}
			</ol>
		</section>

		<!-- File upload -->
		<section>
			<h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Upload File</h2>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors duration-150 cursor-pointer
					{dragging ? 'border-violet-500 bg-violet-950/30' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800/50'}"
				ondragover={(e) => { e.preventDefault(); dragging = true }}
				ondragleave={() => dragging = false}
				ondrop={(e) => { e.preventDefault(); dragging = false; fileName = e.dataTransfer?.files[0]?.name ?? null }}
			>
				<div class="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
				</div>
				{#if fileName}
					<div>
						<p class="text-sm font-medium text-zinc-100">{fileName}</p>
						<p class="text-xs text-zinc-500 mt-0.5">File ready — click Analyze to continue</p>
					</div>
				{:else}
					<div>
						<p class="text-sm font-medium text-zinc-300">Drag & drop your file here</p>
						<p class="text-xs text-zinc-500 mt-0.5">or click to browse — .mp3, .wav, .m4a, .txt</p>
					</div>
				{/if}
				<input type="file" accept=".mp3,.wav,.m4a,.txt" class="absolute inset-0 opacity-0 cursor-pointer" onchange={(e) => { fileName = (e.target as HTMLInputElement).files?.[0]?.name ?? null }} />
			</div>
			<div class="mt-3 flex justify-end">
				<button class="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!fileName}>
					Analyze Call
				</button>
			</div>
		</section>

		<!-- Results -->
		<section class="flex flex-col gap-5">
			<div class="flex items-center gap-3">
				<h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-500">Review</h2>
				<div class="flex-1 h-px bg-zinc-800"></div>
			</div>

			<!-- Summary -->
			<div class="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
				<h3 class="text-sm font-semibold text-zinc-300 mb-2">Summary</h3>
				<p class="text-sm text-zinc-400 leading-relaxed">
					The agent handled an inbound billing inquiry from a returning customer. The core issue — an unexpected charge on the monthly statement — was identified and resolved within the call. The agent demonstrated solid product knowledge but missed opportunities to confirm customer satisfaction before closing.
				</p>
			</div>

			<!-- Pluses & Minuses -->
			<div class="grid grid-cols-2 gap-4">
				<!-- Pluses -->
				<div class="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-5">
					<div class="flex items-center gap-2 mb-3">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
						<h3 class="text-sm font-semibold text-emerald-400">Pluses</h3>
					</div>
					<ul class="flex flex-col gap-2">
						{#each pluses as plus}
							<li class="flex items-start gap-2 text-sm text-zinc-400">
								<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
								{plus}
							</li>
						{/each}
					</ul>
				</div>

				<!-- Minuses -->
				<div class="rounded-xl border border-red-900/60 bg-red-950/20 p-5">
					<div class="flex items-center gap-2 mb-3">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-400"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
						<h3 class="text-sm font-semibold text-red-400">Minuses</h3>
					</div>
					<ul class="flex flex-col gap-2">
						{#each minuses as minus}
							<li class="flex items-start gap-2 text-sm text-zinc-400">
								<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
								{minus}
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Scorecard -->
			<div class="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-semibold text-zinc-300">Scorecard</h3>
					<div class="flex items-center gap-2">
						<span class="text-xs text-zinc-500">Overall</span>
						<span class="text-lg font-bold {overallScore >= 8 ? 'text-emerald-400' : overallScore >= 6 ? 'text-amber-400' : 'text-red-400'}">{overallScore}<span class="text-xs font-normal text-zinc-600">/10</span></span>
					</div>
				</div>
				<ul class="flex flex-col gap-3">
					{#each scorecard as row}
						{@const pct = (row.score / 10) * 100}
						<li class="flex items-center gap-3">
							<span class="w-40 shrink-0 text-sm text-zinc-400">{row.label}</span>
							<div class="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
								<div
									class="h-full rounded-full transition-all duration-500 {row.score >= 8 ? 'bg-emerald-500' : row.score >= 6 ? 'bg-amber-400' : 'bg-red-500'}"
									style="width: {pct}%"
								></div>
							</div>
							<span class="w-8 text-right text-sm font-medium {row.score >= 8 ? 'text-emerald-400' : row.score >= 6 ? 'text-amber-400' : 'text-red-400'}">{row.score}</span>
						</li>
					{/each}
				</ul>
			</div>
		</section>

	</div>
</div>
