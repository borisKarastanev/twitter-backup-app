#!/bin/sh

# This is an automated script for updating the version tag in the package.json
# file based on the last GIT Repository Tag

# Version 1.3.0
# Author: Boris Karastanev
# Email: <boris.karastanev@balkantel.net>
# License: MIT

GREEN='\033[0;32m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

PROJECT_DIR=`pwd`

# [TAG]-[COMITS_AFTTER_LAST_TAG]-[SHA]
GIT_DESCRIBE=`git describe --long`      # 1.2-28-g9cb5fc3 or 1.2-0-g9cb5fc3

# VERSION       = [TAG].[COMITS_AFTTER_LAST_TAG]
# LONG_VERSION  = [VERSION]-[SHA]
# SHORT_VERSION = [VERSION]

SHA=${GIT_DESCRIBE##*-}     # g9cb5fc3
VER_TMP=${GIT_DESCRIBE%-*}  # 1.2-28
VERSION=${VER_TMP/-/.}      # 1.2.28

LONG_VERSION=${VERSION}-${SHA}
SHORT_VERSION=${VERSION}

function apply_version () {

    echo -e "Re-writting ${WHITE}package.json${NC} version with short version: " ${GREEN}${SHORT_VERSION}${NC}
    echo -e "Re-writting ${WHITE}version.js${NC} with short version:${GREEN}${SHORT_VERSION}${NC} and long version: ${GREEN}${LONG_VERSION}${NC}"

    # update the package.json
    sed -i "s/\([[:space:]]\+\"version\"\:[[:space:]]*\"\)\(.*\)\(\"\.*\)/\1${SHORT_VERSION}\3/" package.json

    # update the version.js
    echo -e "module.exports = { full: \"${LONG_VERSION}\", short: \"${SHORT_VERSION}\" };" > src/version.js

}

function restore_version () {
    echo -e "Restoring ${WHITE}package.json${NC} and ${WHITE}version.js${NC}"
    git checkout -- package.json
    git checkout -- src/version.js
}

function make_npm () {
    npm pack
}


#
# main
#
apply_version
make_npm
restore_version
