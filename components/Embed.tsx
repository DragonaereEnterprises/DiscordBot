import { Embed } from "reacord"
import React from "react"

export function EmbedMessage({title, description, url, thumbnail, footer}: {title?: string, description?: string, url?: string | undefined, thumbnail?: {url: string} | undefined, footer?: {text: string, iconUrl: string | undefined}| undefined }) {
	return (
		<Embed
			title={title}
			description={description}
      url={url}
      thumbnail={thumbnail}
      footer={footer}
			color={0xF46904}
			timestamp={Date.now()}
		/>
	)
}

export function EmbedError({title = "Error", description}: any) {
	return (
		<Embed
			title={title}
			description={description}
			color={0xF40000}
			timestamp={Date.now()}
		/>
	)
}

export function EmbedDefaultError() {
	return (
		<Embed
			title="Error"
			description="An error has occurred"
			color={0xF40000}
			timestamp={Date.now()}
		/>
	)
}