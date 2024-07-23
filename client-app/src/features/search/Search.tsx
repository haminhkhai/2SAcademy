import TextInput from "../form/TextInput";

export default function Search() {
	return (
		<div className='search'>
			<form className='form'>
				<TextInput name="query" icon='search' placeHolder="Search"/>
				
			</form>
			<div className="search__result">
				<h2 className="search__group-title">
					COURSE
				</h2>
				<ul className="search__item-list">
					<li className="search__item">Beginner course</li>
					<li className="search__item">Intermediate course</li>
					<li className="search__item">Advance course</li>
				</ul>
			</div>
			<div className="search__result">
				<h2 className="search__group-title">
					BLOG
				</h2>
				<ul className="search__item-list">
					<li className="search__item">How to DJ</li>
					<li className="search__item">Social media for DJ</li>
					<li className="search__item">Speaker for DJ</li>
				</ul>
			</div>
		</div>
	);
}
