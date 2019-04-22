#!/usr/bin/env python
#  -*- coding: utf-8 -*-
from __future__ import print_function

import web
import json

from time import sleep
from sys import stdout
from daqhats_utils import select_hat_device, enum_mask_to_string
from daqhats import mcc118, OptionFlags, HatIDs, HatError

# Constants
CURSOR_BACK_2 = '\x1b[2D'
ERASE_TO_END_OF_LINE = '\x1b[0K'

urls = (
    '/(.*)', 'hello'
)
app = web.application(urls, globals())


options = OptionFlags.DEFAULT
low_chan = 0
high_chan = 7
mcc_118_num_channels = mcc118.info().NUM_AI_CHANNELS

# Get an instance of the selected hat device object.
address = select_hat_device(HatIDs.MCC_118)
hat = mcc118(address)

class hello:
    def GET(self, name):
        #if not name:
        #    name = 'World'
        #return 'Hello, ' + name + '!'
        #pyDict = {'one':1,'two':2}
        pyDict = {0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0}

        global hat

        try:
            # Read a single value from each selected channel.
            for chan in range(low_chan, high_chan + 1):
                value = hat.a_in_read(chan, options)
                print('{:12.5} V'.format(value), end='')
                pyDict[chan] = value

            #stdout.flush()

        except KeyboardInterrupt:
            # Clear the '^C' from the display.
            print(CURSOR_BACK_2, ERASE_TO_END_OF_LINE, '\n')


        web.header('Content-Type', 'application/json')
        web.header("Access-Control-Allow-Origin", "*")
        return json.dumps(pyDict)

if __name__ == "__main__":

    try:
        # Ensure low_chan and high_chan are valid.
        if low_chan < 0 or low_chan >= mcc_118_num_channels:
            error_message = ('Error: Invalid low_chan selection - must be '
                             '0 - {0:d}'.format(mcc_118_num_channels - 1))
            raise Exception(error_message)
        if high_chan < 0 or high_chan >= mcc_118_num_channels:
            error_message = ('Error: Invalid high_chan selection - must be '
                             '0 - {0:d}'.format(mcc_118_num_channels - 1))
            raise Exception(error_message)
        if low_chan > high_chan:
            error_message = ('Error: Invalid channels - high_chan must be '
                             'greater than or equal to low_chan')
            raise Exception(error_message)

        # Get an instance of the selected hat device object.
        global address
        global hat
        #address = select_hat_device(HatIDs.MCC_118)
        #hat = mcc118(address)

        print('\nMCC 118 single data value read example')
        print('    Function demonstrated: mcc118.a_in_read')
        print('    Channels: {0:d} - {1:d}'.format(low_chan, high_chan))
        print('    Options:', enum_mask_to_string(OptionFlags, options))
        try:
            input("\nPress 'Enter' to continue")
        except (NameError, SyntaxError):
            pass

        print('\nAcquiring data ... Press Ctrl-C to abort')

        #loop

    except (HatError, ValueError) as error:
        print('\n', error)

    app.run()

