import React from 'react';

export default function Footer() {
	return (
		<footer className="bg-transparent border-t border-white/5 text-gray-400 text-sm py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
				<div>© {new Date().getFullYear()} AutoArch — Built for architecture diagrams</div>
				<div className="flex items-center gap-4">
					<button onClick={() => {}} className="hover:text-white bg-transparent">Privacy</button>
					<button onClick={() => {}} className="hover:text-white bg-transparent">Terms</button>
					<a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
				</div>
			</div>
		</footer>
	);
}
