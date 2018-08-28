#!/bin/sh
set -e

while true; do 
  for i in $(cat location.txt ); do
    gq http://localhost:8000/v1alpha1/graphql -q "mutation insert_driver_location { insert_driver_location (objects: [{driver_id: 1,location: \"$i\"}]){returning {id}}}";
    sleep 5;
  done;
done;
