const spriteConfig = {
	shape: {
		dimension: {
			maxWidth: 500,
			maxHeight: 500
		},
		spacing: {
			padding: 0
		},
		transform: [{
			"svgo": {
				"plugins": [
					{
						name: "removeViewBox",
						active: false,
					},
					{
						name: "removeUnusedNS",
						active: false,
					},
					{
						name: "removeUselessStrokeAndFill",
						active: true,
					},
					{
						name: "cleanupIDs",
						active: false,
					},
					{
						name: "removeComments",
						active: true,
					},
					{
						name: "removeEmptyAttrs",
						active: true,
					},
					{
						name: "removeEmptyText",
						active: true,
					},
					{
						name: "collapseGroups",
						active: true,
					},
					{
						name: "collapseGroups",
						active: true,
					},
					{
						name: "removeAttrs",
						params: {attrs: '(fill|stroke|style)'}
					}
				]
			}
		}]
	},
	mode: {
		symbol: {
			dest: '.',
			sprite: 'sprite.svg'
		}
	}
}

export {spriteConfig}
