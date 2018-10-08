import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import { withNavigation } from 'react-navigation';
import { createMultiUpdateAction } from '../../actions';
import ControlDetailsUi from './ControlDetailsUi';

function _buildSections({ duplicates, overflow }) {

    const sections = [];

    if (duplicates && duplicates.length > 0) {

        const sectionItems = [];
        duplicates.forEach(element => {
            const catId = element.category;
            element.duplicates.forEach(dupicatedTagId => {
                sectionItems.push({
                    type: 'duplicates',
                    category: catId,
                    tag: dupicatedTagId,
                    key: `${catId}_${dupicatedTagId}` // key property to avoid keyExtractor
                })
            })
        });

        sections.push({
            title: 'Duplicated tags',
            data: sectionItems
        });
    }

    if (overflow && overflow.length > 0) {
        sections.push({
            title: 'Overfilled categories',
            data: overflow.map(element => {
                return { 
                    type: 'overflow',
                    category: element.category,
                    count: element.count,
                    key: element.category
                }})
        });
    }

    return sections;
}

const controlsSelector = state => state.get('controls').get('errors');
const sectionsSelector = createSelector(controlsSelector,  _buildSections);

const mapStateToProps = state => {
    return {
        sections: sectionsSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onRemoveDuplicate: (catId, tagId) => {
            let updates = global.hashtagPersistenceManager.removeTagFromCategory(catId, tagId);
            dispatch(createMultiUpdateAction(updates));
        }
    }
}

const ControlDetails = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withNavigation
    )(ControlDetailsUi);

export default ControlDetails;