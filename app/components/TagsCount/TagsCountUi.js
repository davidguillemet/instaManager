import React from 'react';
import Message from './../Message';

class TagsCountUi extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        
        const remainingTags = this.props.maxTagsCount - this.props.tagsCount;
        const remainingError = remainingTags < 0;
        const tagCount = `${this.props.tagsCount} Tag(s) in total - `;
        const remainingTip = remainingError ? `${-remainingTags} in excess` : `${remainingTags} remaining`;
    
        return (
            <Message message={tagCount + remainingTip} error={remainingError} centered/>
        );
    }
}

export default TagsCountUi;
    