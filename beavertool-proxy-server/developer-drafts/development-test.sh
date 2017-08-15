#!/bin/bash -e
#no cd required to run this script



SCRIPT_FOLDER=$(dirname "$0")
cd $SCRIPT_FOLDER
PARENT_ABS_PATH=`pwd` #/`basename "$0"` #http://stackoverflow.com/questions/192319/how-do-i-know-the-script-file-name-in-a-bash-script
cd ..
#now, the folder where we are positioned must have all the needed node-modules


ROOT_NOW=`pwd`
echo "folder root=$ROOT_NOW"

cmd="$PARENT_ABS_PATH/development-test.js"
echo starting $cmd
node $cmd


