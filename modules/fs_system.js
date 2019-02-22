// origin: project or ticket

const fs = require('fs')
const system_dir = './public/system'

const db = require('../modules/db.js')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

const system = {
	saveMarkdown: async (origin, id, type, markdown) => {
		let md_url = ''

		if(origin === 'project')
			md_url = `${system_dir}/markdown/project/${id}.md`
		else if(origin === 'ticket')
			md_url = `${system_dir}/markdown/ticket/${id}_${type}.md`
		else
			throw new Error()
		
		console.log('Content to MD: ' + markdown)

		fs.writeFile(md_url, markdown, (err) => {
			if(err) throw err
		})

		return await db.saveMarkdown(origin, id, type, md.render(markdown))
	},

	getMarkdown: async (origin, id, type) => {
		let md_url = ''
		let markdown = '';

		if(origin === 'project')
			md_url = `${system_dir}/markdown/project/${id}.md`
		else if(origin === 'ticket')
			md_url = `${system_dir}/markdown/ticket/${id}_${type}.md`
		else
			throw new Error()

		try {
			markdown = fs.readFileSync(md_url, 'utf8')
		} catch (e) {
			console.log(e)
		}
		
		let html = await db.getMarkdown(origin, id, type) || " "

		return {markdown, html}
	}

}

module.exports = system