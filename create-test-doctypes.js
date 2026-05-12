// Run this in the Umbraco backoffice browser console (F12) to create test document types
// This script creates doctypes for testing DocTypeDoctor analysis features

async function createTestDoctypes() {
    const baseUrl = '/umbraco/management/api/v1/document-type';

    // Helper function to create a document type
    async function createDocumentType(name, alias, icon = 'icon-document') {
        const response = await fetch(`${baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                alias: alias,
                icon: icon,
                allowedAsRoot: true,
                isElement: false,
                containers: [
                    {
                        name: 'General',
                        alias: 'general',
                        type: 'Group'
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create ${name}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Created: ${name} (ID: ${data.id})`);
        return data.id;
    }

    // Helper function to add a property to a document type
    async function addProperty(documentTypeId, alias, name, editorAlias, containerAlias = 'general') {
        const response = await fetch(`${baseUrl}/${documentTypeId}/property`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alias: alias,
                name: name,
                editorAlias: editorAlias,
                container: {
                    alias: containerAlias
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to add property ${alias}: ${response.statusText}`);
        }

        console.log(`Added property: ${name} (${alias}) to ${documentTypeId}`);
    }

    // Helper function to add composition
    async function addComposition(documentTypeId, compositionTypeId) {
        const response = await fetch(`${baseUrl}/${documentTypeId}/composition`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                composition: {
                    id: compositionTypeId
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to add composition: ${response.statusText}`);
        }

        console.log(`Added composition: ${compositionTypeId} to ${documentTypeId}`);
    }

    try {
        console.log('Creating test document types...');

        // High Similarity A (95% similar to B - should recommend merge)
        const highSimAId = await createDocumentType('High Similarity A', 'highSimilarityA');
        await addProperty(highSimAId, 'title', 'Title', 'Umbraco.TextBox');
        await addProperty(highSimAId, 'bodyText', 'Body Text', 'Umbraco.TextArea');
        await addProperty(highSimAId, 'author', 'Author', 'Umbraco.TextBox');
        await addProperty(highSimAId, 'publishDate', 'Publish Date', 'Umbraco.DateTime');
        await addProperty(highSimAId, 'category', 'Category', 'Umbraco.DropDown.Flexible');
        await addProperty(highSimAId, 'featuredImage', 'Featured Image', 'Umbraco.MediaPicker3');
        await addProperty(highSimAId, 'tags', 'Tags', 'Umbraco.Tags');
        await addProperty(highSimAId, 'summary', 'Summary', 'Umbraco.TextArea');
        await addProperty(highSimAId, 'metaDescription', 'Meta Description', 'Umbraco.TextBox');
        await addProperty(highSimAId, 'metaKeywords', 'Meta Keywords', 'Umbraco.TextBox');

        // High Similarity B (95% similar to A - should recommend merge)
        const highSimBId = await createDocumentType('High Similarity B', 'highSimilarityB');
        await addProperty(highSimBId, 'title', 'Title', 'Umbraco.TextBox');
        await addProperty(highSimBId, 'bodyText', 'Body Text', 'Umbraco.TextArea');
        await addProperty(highSimBId, 'author', 'Author', 'Umbraco.TextBox');
        await addProperty(highSimBId, 'publishDate', 'Publish Date', 'Umbraco.DateTime');
        await addProperty(highSimBId, 'category', 'Category', 'Umbraco.DropDown.Flexible');
        await addProperty(highSimBId, 'featuredImage', 'Featured Image', 'Umbraco.MediaPicker3');
        await addProperty(highSimBId, 'tags', 'Tags', 'Umbraco.Tags');
        await addProperty(highSimBId, 'summary', 'Summary', 'Umbraco.TextArea');
        await addProperty(highSimBId, 'metaDescription', 'Meta Description', 'Umbraco.TextBox');
        await addProperty(highSimBId, 'metaKeywords', 'Meta Keywords', 'Umbraco.TextBox');
        await addProperty(highSimBId, 'extraField', 'Extra Field', 'Umbraco.TextBox'); // One extra field

        // Medium Similarity A (75% similar to B - should recommend composition)
        const mediumSimAId = await createDocumentType('Medium Similarity A', 'mediumSimilarityA');
        await addProperty(mediumSimAId, 'headline', 'Headline', 'Umbraco.TextBox');
        await addProperty(mediumSimAId, 'content', 'Content', 'Umbraco.TextArea');
        await addProperty(mediumSimAId, 'author', 'Author', 'Umbraco.TextBox');
        await addProperty(mediumSimAId, 'publishedDate', 'Published Date', 'Umbraco.DateTime');
        await addProperty(mediumSimAId, 'image', 'Image', 'Umbraco.MediaPicker3');
        await addProperty(mediumSimAId, 'tags', 'Tags', 'Umbraco.Tags');

        // Medium Similarity B (75% similar to A - should recommend composition)
        const mediumSimBId = await createDocumentType('Medium Similarity B', 'mediumSimilarityB');
        await addProperty(mediumSimBId, 'headline', 'Headline', 'Umbraco.TextBox');
        await addProperty(mediumSimBId, 'content', 'Content', 'Umbraco.TextArea');
        await addProperty(mediumSimBId, 'writer', 'Writer', 'Umbraco.TextBox'); // Different name
        await addProperty(mediumSimBId, 'publishedDate', 'Published Date', 'Umbraco.DateTime');
        await addProperty(mediumSimBId, 'thumbnail', 'Thumbnail', 'Umbraco.MediaPicker3'); // Different name
        await addProperty(mediumSimBId, 'categories', 'Categories', 'Umbraco.DropDown.Flexible'); // Different type
        await addProperty(mediumSimBId, 'rating', 'Rating', 'Umbraco.Integer'); // Extra field

        // Deep Composition Chain (7 levels deep - should flag as high severity)
        const compositionLevel0Id = await createDocumentType('Composition Level 0', 'compositionLevel0');
        await addProperty(compositionLevel0Id, 'baseField', 'Base Field', 'Umbraco.TextBox');

        const compositionLevel1Id = await createDocumentType('Composition Level 1', 'compositionLevel1');
        await addComposition(compositionLevel1Id, compositionLevel0Id);
        await addProperty(compositionLevel1Id, 'level1Field', 'Level 1 Field', 'Umbraco.TextBox');

        const compositionLevel2Id = await createDocumentType('Composition Level 2', 'compositionLevel2');
        await addComposition(compositionLevel2Id, compositionLevel1Id);
        await addProperty(compositionLevel2Id, 'level2Field', 'Level 2 Field', 'Umbraco.TextBox');

        const compositionLevel3Id = await createDocumentType('Composition Level 3', 'compositionLevel3');
        await addComposition(compositionLevel3Id, compositionLevel2Id);
        await addProperty(compositionLevel3Id, 'level3Field', 'Level 3 Field', 'Umbraco.TextBox');

        const compositionLevel4Id = await createDocumentType('Composition Level 4', 'compositionLevel4');
        await addComposition(compositionLevel4Id, compositionLevel3Id);
        await addProperty(compositionLevel4Id, 'level4Field', 'Level 4 Field', 'Umbraco.TextBox');

        const compositionLevel5Id = await createDocumentType('Composition Level 5', 'compositionLevel5');
        await addComposition(compositionLevel5Id, compositionLevel4Id);
        await addProperty(compositionLevel5Id, 'level5Field', 'Level 5 Field', 'Umbraco.TextBox');

        const compositionLevel6Id = await createDocumentType('Composition Level 6', 'compositionLevel6');
        await addComposition(compositionLevel6Id, compositionLevel5Id);
        await addProperty(compositionLevel6Id, 'level6Field', 'Level 6 Field', 'Umbraco.TextBox');

        // Naming Inconsistency 1 (camelCase)
        const namingInconsistency1Id = await createDocumentType('Naming Inconsistency 1', 'namingInconsistency1');
        await addProperty(namingInconsistency1Id, 'firstName', 'First Name', 'Umbraco.TextBox');
        await addProperty(namingInconsistency1Id, 'lastName', 'Last Name', 'Umbraco.TextBox');
        await addProperty(namingInconsistency1Id, 'emailAddress', 'Email Address', 'Umbraco.TextBox');
        await addProperty(namingInconsistency1Id, 'phoneNumber', 'Phone Number', 'Umbraco.TextBox');

        // Naming Inconsistency 2 (snake_case)
        const namingInconsistency2Id = await createDocumentType('Naming Inconsistency 2', 'namingInconsistency2');
        await addProperty(namingInconsistency2Id, 'first_name', 'First Name', 'Umbraco.TextBox');
        await addProperty(namingInconsistency2Id, 'last_name', 'Last Name', 'Umbraco.TextBox');
        await addProperty(namingInconsistency2Id, 'email_address', 'Email Address', 'Umbraco.TextBox');
        await addProperty(namingInconsistency2Id, 'phone_number', 'Phone Number', 'Umbraco.TextBox');

        // Naming Inconsistency 3 (kebab-case)
        const namingInconsistency3Id = await createDocumentType('Naming Inconsistency 3', 'namingInconsistency3');
        await addProperty(namingInconsistency3Id, 'first-name', 'First Name', 'Umbraco.TextBox');
        await addProperty(namingInconsistency3Id, 'last-name', 'Last Name', 'Umbraco.TextBox');
        await addProperty(namingInconsistency3Id, 'email-address', 'Email Address', 'Umbraco.TextBox');
        await addProperty(namingInconsistency3Id, 'phone-number', 'Phone Number', 'Umbraco.TextBox');

        // Unused Properties Test (many unused fields)
        const unusedPropertiesTestId = await createDocumentType('Unused Properties Test', 'unusedPropertiesTest');
        await addProperty(unusedPropertiesTestId, 'title', 'Title', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField1', 'Unused Field 1', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField2', 'Unused Field 2', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField3', 'Unused Field 3', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField4', 'Unused Field 4', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField5', 'Unused Field 5', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField6', 'Unused Field 6', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField7', 'Unused Field 7', 'Umbraco.TextBox');
        await addProperty(unusedPropertiesTestId, 'unusedField8', 'Unused Field 8', 'Umbraco.TextBox');

        console.log('✅ All test document types created successfully!');
        console.log('Now create some content nodes to test unused properties detection.');
        console.log('For the "Unused Properties Test" doctype, only fill in the "title" field and leave the rest empty.');

    } catch (error) {
        console.error('❌ Error creating test document types:', error);
    }
}

// Run the function
createTestDoctypes();
