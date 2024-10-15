import pandas as pd

# Load the dataset and drop rows with any NaN values
df_unfiltered = pd.read_csv('Dataset/medicine_dataset.csv', low_memory=False)
df_unfiltered = df_unfiltered.iloc[:, [0, 1, 2, 3, 4, 7, 8, 9, 49]]
df = df_unfiltered.dropna()

def clean_data(value):
    """Returns the value if it's not NaN, otherwise returns a default value."""
    return value if pd.notna(value) and value != '' else "Information not available"

def get_medicine_details(partial_name):
    # Find rows where the name contains the partial name
    matching_rows = df[df['name'].str.contains(partial_name, case=False, na=False)]

    if not matching_rows.empty:
        if matching_rows.shape[0] > 1:
            # If multiple matches found, return a list of dictionaries
            matches = []
            for _, row in matching_rows.iterrows():
                match = {
                    'name': clean_data(row['name']),
                    'use': clean_data(row['use0']),
                    'side_effects': [
                        clean_data(row['sideEffect0']),
                        clean_data(row['sideEffect1']),
                        clean_data(row['sideEffect2'])
                    ],
                    'substitutes': [
                        clean_data(row['substitute0']),
                        clean_data(row['substitute1']),
                        clean_data(row['substitute2'])
                    ]
                }
                matches.append(match)
            return matches
        else:
            # If only one match found, return a single dictionary
            selected_row = matching_rows.iloc[0]
            return {
                'name': clean_data(selected_row['name']),
                'use': clean_data(selected_row['use0']),
                'side_effects': [
                    clean_data(selected_row['sideEffect0']),
                    clean_data(selected_row['sideEffect1']),
                    clean_data(selected_row['sideEffect2'])
                ],
                'substitutes': [
                    clean_data(selected_row['substitute0']),
                    clean_data(selected_row['substitute1']),
                    clean_data(selected_row['substitute2'])
                ]
            }
    else:
        return {"error": "No matches found."}
