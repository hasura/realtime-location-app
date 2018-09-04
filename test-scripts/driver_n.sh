#!/bin/sh
set -e

while true; do 
  for i in $(cat result.txt ); do
    gq http://localhost:8000/v1alpha1/graphql -q "mutation insert_driver_location { insert_driver_location (objects: [{driver_id: \"27008677-3539-4e75-83c3-ca044c498d34\",location: \"$i\"}]){returning {id}}}";
    sleep 3;
  done;
done;
